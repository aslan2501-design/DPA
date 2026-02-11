/**
 * Service Worker - Port Navigator
 * نظام ذكي للتخزين المؤقت والعمل بدون اتصال إنترنت
 * 
 * يدعم:
 * - تخزين مؤقت للخرائط والصور
 * - تخزين مؤقت للـ JSON الثابتة
 * - تخزين مؤقت للـ PDF
 * - المساحة: 100+ MB
 */

const CACHE_NAME = 'port-navigator-v1';
const RUNTIME_CACHE = 'port-navigator-runtime';
const MAP_CACHE = 'port-navigator-maps';
const IMAGE_CACHE = 'port-navigator-images';
const JSON_CACHE = 'port-navigator-json';
const PDF_CACHE = 'port-navigator-pdfs';

const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/offline.html',
];

const STATIC_ASSET_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.svg$/,
  /\.woff2?$/,
];

const MAP_PATTERNS = [
  /\/maps\//,
  /\.geojson$/,
  /\.geoserver\//,
];

const IMAGE_PATTERNS = [
  /\.(png|jpg|jpeg|gif|webp)$/i,
  /\/images\//,
  /\/assets\/images\//,
];

const JSON_PATTERNS = [
  /\.json$/,
  /\/data\//,
  /\/api\/.*\.json$/,
];

const PDF_PATTERNS = [
  /\.pdf$/,
  /\/documents\//,
  /\/reports\//,
];

// Cache sizes (للحد من الضغط على الذاكرة)
const CACHE_SIZE_LIMITS = {
  [IMAGE_CACHE]: 50 * 1024 * 1024,      // 50 MB للصور
  [MAP_CACHE]: 30 * 1024 * 1024,        // 30 MB للخرائط
  [JSON_CACHE]: 10 * 1024 * 1024,       // 10 MB للـ JSON
  [PDF_CACHE]: 15 * 1024 * 1024,        // 15 MB للـ PDF
  [RUNTIME_CACHE]: 5 * 1024 * 1024,     // 5 MB للـ Runtime
};

/**
 * تثبيت Service Worker
 * تخزين مؤقت للأصول الأساسية
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CACHE_URLS).catch(() => {
          console.warn('[SW] Some assets failed to cache');
        });
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * تنشيط Service Worker
 * تنظيف الـ Caches القديمة
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && !cacheName.includes('port-navigator')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * اعتراض الطلبات والرد من الـ Cache
 * استراتيجية Network-First مع Cache Fallback
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // تجاهل الطلبات غير HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // تجاهل طلبات API (يجب أن تأتي من الشبكة)
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // الخرائط: cache-first
  if (isMapRequest(url)) {
    event.respondWith(cacheFirstStrategy(event.request, MAP_CACHE));
    return;
  }

  // الصور: cache-first
  if (isImageRequest(url)) {
    event.respondWith(cacheFirstStrategy(event.request, IMAGE_CACHE));
    return;
  }

  // JSON الثابتة: cache-first
  if (isJsonRequest(url)) {
    event.respondWith(cacheFirstStrategy(event.request, JSON_CACHE));
    return;
  }

  // PDF: cache-first
  if (isPdfRequest(url)) {
    event.respondWith(cacheFirstStrategy(event.request, PDF_CACHE));
    return;
  }

  // الأصول الثابتة (JS, CSS, SVG, Fonts): cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(event.request, CACHE_NAME));
    return;
  }

  // باقي الطلبات: network-first
  event.respondWith(networkFirstStrategy(event.request));
});

/**
 * استراتيجية Network-First
 * حاول الشبكة أولاً، ثم استخدم الـ Cache
 */
function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      // تخزين مؤقت للاستجابات الناجحة
      if (response.ok && isCacheable(request)) {
        const cacheName = getCacheNameForRequest(request);
        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
          checkCacheSize(cacheName);
        });
      }
      return response;
    })
    .catch(() => {
      // عند فشل الشبكة، اسحب من الـ Cache
      return caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // إذا لم يكن في الـ Cache، أعد صفحة offline
          if (request.mode === 'navigate') {
            return caches.match('/offline.html')
              .then((offlinePage) => offlinePage || createOfflineResponse());
          }
          return createErrorResponse();
        });
    });
}

/**
 * استراتيجية Cache-First
 * استخدم الـ Cache أولاً، ثم حاول الشبكة
 */
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        // تحديث الـ Cache في الخلفية
        updateCacheInBackground(request, cacheName);
        return response.clone();
      }
      
      // إذا لم يكن في الـ Cache، احصل من الشبكة
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
                checkCacheSize(cacheName);
              });
          }
          return response;
        })
        .catch(() => {
          // Offline: ادعم القراءة من القديم
          return createOfflineResponse(`Unable to load ${request.url}`);
        });
    });
}

/**
 * تحديث الـ Cache في الخلفية
 * (بدون تأخير الاستجابة الحالية)
 */
function updateCacheInBackground(request, cacheName) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
          checkCacheSize(cacheName);
        });
      }
    })
    .catch(() => {
      // تجاهل أخطاء التحديث
    });
}

/**
 * التحقق من حجم الـ Cache
 * حذف العناصر القديمة إذا تجاوز الحد
 */
async function checkCacheSize(cacheName) {
  const limit = CACHE_SIZE_LIMITS[cacheName];
  if (!limit) return;

  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const size = await getResponseSize(response);
        
        // حساب الحجم الإجمالي
        let totalSize = 0;
        for (const req of keys) {
          const res = await cache.match(req);
          if (res) {
            totalSize += await getResponseSize(res);
          }
        }

        // حذف العناصر القديمة إذا تجاوز الحد
        if (totalSize > limit) {
          console.log(`[SW] Cache ${cacheName} exceeded limit, removing old items`);
          await cache.delete(request);
          break; // حذف عنصر واحد فقط في كل مرة
        }
      }
    }
  } catch (error) {
    console.error('[SW] Error checking cache size:', error);
  }
}

/**
 * حساب حجم الاستجابة (تقريبي)
 */
async function getResponseSize(response) {
  try {
    if (!response) return 0;
    const blob = await response.blob();
    return blob.size;
  } catch {
    return 0;
  }
}

/**
 * التحقق من نوع الطلب
 */
function isMapRequest(url) {
  return MAP_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

function isImageRequest(url) {
  return IMAGE_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

function isJsonRequest(url) {
  return JSON_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

function isPdfRequest(url) {
  return PDF_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

function isStaticAsset(url) {
  return STATIC_ASSET_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

function isCacheable(request) {
  return request.method === 'GET';
}

/**
 * اختيار اسم الـ Cache المناسب
 */
function getCacheNameForRequest(request) {
  const url = new URL(request.url);
  
  if (isMapRequest(url)) return MAP_CACHE;
  if (isImageRequest(url)) return IMAGE_CACHE;
  if (isJsonRequest(url)) return JSON_CACHE;
  if (isPdfRequest(url)) return PDF_CACHE;
  if (isStaticAsset(url)) return CACHE_NAME;
  
  return RUNTIME_CACHE;
}

/**
 * إنشاء استجابة خطأ
 */
function createErrorResponse() {
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'Unable to connect to the network',
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * إنشاء استجابة offline
 */
function createOfflineResponse(message = null) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        p { color: #666; }
        .offline-indicator {
          font-size: 64px;
          margin-bottom: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="offline-indicator">📡</div>
        <h1>You're Offline</h1>
        <p>No internet connection available</p>
        ${message ? `<p style="color: #999; font-size: 14px;">${message}</p>` : ''}
        <p style="margin-top: 2rem; color: #999; font-size: 14px;">
          Please check your connection and try again.
        </p>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

/**
 * معالجة رسائل من العميل
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const cacheName = event.data.cacheName;
    caches.delete(cacheName).then(() => {
      console.log(`[SW] Cleared cache: ${cacheName}`);
      event.ports[0].postMessage({ success: true });
    });
  }

  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    getCacheInfo().then((info) => {
      event.ports[0].postMessage(info);
    });
  }
});

/**
 * الحصول على معلومات الـ Caches
 */
async function getCacheInfo() {
  try {
    const cacheNames = await caches.keys();
    const info = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      let totalSize = 0;

      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          totalSize += await getResponseSize(response);
        }
      }

      info[cacheName] = {
        size: totalSize,
        count: keys.length,
        limit: CACHE_SIZE_LIMITS[cacheName] || 'unlimited',
      };
    }

    return info;
  } catch (error) {
    console.error('[SW] Error getting cache info:', error);
    return {};
  }
}

console.log('[SW] Service Worker loaded and ready');
