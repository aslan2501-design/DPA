/**
 * CacheManager: واجهة للتواصل مع Service Worker
 * إدارة التخزين المؤقت للأصول الثابتة (خرائط، صور، JSON، PDF)
 * المساحة: 100+ MB
 */

export interface CacheInfo {
  [cacheName: string]: {
    size: number;
    count: number;
    limit: number | string;
  };
}

class CacheManagerClass {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'caches' in window;
  }

  /**
   * تسجيل Service Worker
   */
  async register(swPath: string = '/sw.js'): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Service Workers not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register(swPath, {
        scope: '/',
      });

      console.log('[CacheManager] Service Worker registered:', this.registration);

      // استمع للتحديثات
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[CacheManager] New Service Worker ready, reload to activate');
              // يمكن إظهار تنبيه للمستخدم
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error('[CacheManager] Failed to register Service Worker:', error);
      return false;
    }
  }

  /**
   * الحصول على معلومات الـ Caches
   */
  async getCacheInfo(): Promise<CacheInfo> {
    if (!this.isSupported) {
      return {};
    }

    try {
      const cacheNames = await caches.keys();
      const info: CacheInfo = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        let totalSize = 0;

        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            totalSize += this.getResponseSize(response);
          }
        }

        info[cacheName] = {
          size: totalSize,
          count: keys.length,
          limit: 'unlimited',
        };
      }

      return info;
    } catch (error) {
      console.error('[CacheManager] Error getting cache info:', error);
      return {};
    }
  }

  /**
   * مسح cache معين
   */
  async clearCache(cacheName: string): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      const success = await caches.delete(cacheName);
      console.log(`[CacheManager] Cleared cache: ${cacheName}`, success);
      return success;
    } catch (error) {
      console.error('[CacheManager] Error clearing cache:', error);
      return false;
    }
  }

  /**
   * مسح جميع الـ Caches
   */
  async clearAllCaches(): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log('[CacheManager] Cleared all caches');
      return true;
    } catch (error) {
      console.error('[CacheManager] Error clearing all caches:', error);
      return false;
    }
  }

  /**
   * مسح cache معين للخرائط
   */
  async clearMapsCache(): Promise<boolean> {
    return this.clearCache('port-navigator-maps');
  }

  /**
   * مسح cache الصور
   */
  async clearImagesCache(): Promise<boolean> {
    return this.clearCache('port-navigator-images');
  }

  /**
   * مسح cache JSON
   */
  async clearJsonCache(): Promise<boolean> {
    return this.clearCache('port-navigator-json');
  }

  /**
   * مسح cache PDF
   */
  async clearPdfsCache(): Promise<boolean> {
    return this.clearCache('port-navigator-pdfs');
  }

  /**
   * حساب الحجم الإجمالي للـ Caches
   */
  async getTotalCacheSize(): Promise<number> {
    if (!this.isSupported) {
      return 0;
    }

    try {
      const info = await this.getCacheInfo();
      return Object.values(info).reduce((total, cache) => total + cache.size, 0);
    } catch (error) {
      console.error('[CacheManager] Error calculating total cache size:', error);
      return 0;
    }
  }

  /**
   * تنسيق حجم البايتات
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * التحقق من توفر Service Worker
   */
  isServiceWorkerSupported(): boolean {
    return this.isSupported;
  }

  /**
   * الحصول على Service Worker registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  /**
   * تحديث Service Worker
   */
  async updateServiceWorker(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      await this.registration.update();
      console.log('[CacheManager] Service Worker updated');
    } catch (error) {
      console.error('[CacheManager] Error updating Service Worker:', error);
    }
  }

  /**
   * إلغاء تسجيل Service Worker (للتنظيف)
   */
  async unregister(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      const success = await this.registration.unregister();
      if (success) {
        console.log('[CacheManager] Service Worker unregistered');
        this.registration = null;
      }
    } catch (error) {
      console.error('[CacheManager] Error unregistering Service Worker:', error);
    }
  }

  /**
   * حساب حجم الاستجابة (تقريبي)
   */
  private getResponseSize(response: Response): number {
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      return parseInt(contentLength, 10);
    }
    return 0;
  }

  /**
   * الاستماع لتغييرات Service Worker
   */
  onServiceWorkerReady(callback: () => void): void {
    if (!this.isSupported) {
      return;
    }

    navigator.serviceWorker.ready.then(() => {
      callback();
      console.log('[CacheManager] Service Worker is ready');
    });
  }

  /**
   * الاستماع للتحديثات
   */
  onServiceWorkerUpdate(callback: () => void): void {
    if (!this.registration) {
      return;
    }

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            callback();
          }
        });
      }
    });
  }

  /**
   * الحصول على قائمة URLs المخزنة في cache معين
   */
  async getCacheUrls(cacheName: string): Promise<string[]> {
    if (!this.isSupported) {
      return [];
    }

    try {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      return keys.map((request) => request.url);
    } catch (error) {
      console.error('[CacheManager] Error getting cache URLs:', error);
      return [];
    }
  }

  /**
   * حذف URL محدد من cache
   */
  async removeFromCache(cacheName: string, url: string): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      const cache = await caches.open(cacheName);
      return await cache.delete(url);
    } catch (error) {
      console.error('[CacheManager] Error removing from cache:', error);
      return false;
    }
  }

  /**
   * إضافة URL إلى cache يدويـاً
   */
  async addToCache(cacheName: string, url: string): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      const cache = await caches.open(cacheName);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await cache.put(url, response);
      console.log(`[CacheManager] Added ${url} to ${cacheName}`);
      return true;
    } catch (error) {
      console.error('[CacheManager] Error adding to cache:', error);
      return false;
    }
  }

  /**
   * معلومات الـ Cache الكاملة بصيغة سهلة
   */
  async getCacheSummary() {
    const info = await this.getCacheInfo();
    const totalSize = Object.values(info).reduce((sum, cache) => sum + cache.size, 0);

    return {
      totalSize: this.formatBytes(totalSize),
      totalSizeBytes: totalSize,
      totalItems: Object.values(info).reduce((sum, cache) => sum + cache.count, 0),
      caches: Object.entries(info).map(([name, data]) => ({
        name,
        size: this.formatBytes(data.size),
        sizeBytes: data.size,
        items: data.count,
        percentage: totalSize > 0 ? ((data.size / totalSize) * 100).toFixed(1) : 0,
      })),
    };
  }
}

// Singleton instance
export const CacheManager = new CacheManagerClass();
