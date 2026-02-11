/**
 * CacheStatus Component - عرض حالة الـ Cache والاتصال
 * يعرض معلومات الـ Cache المخزنة والحالة الحالية
 */

import React from 'react';
import { Wifi, WifiOff, Trash2, RefreshCw, HardDrive } from 'lucide-react';
import { useCacheManager } from '@/hooks/useCacheManager';

interface CacheStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function CacheStatus({ showDetails = true, className = '' }: CacheStatusProps) {
  const {
    summary,
    loading,
    isSupported,
    isOnline,
    refreshCache,
    clearAllCaches,
    clearMapsCache,
    clearImagesCache,
    clearJsonCache,
    clearPdfsCache,
  } = useCacheManager();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleClearAll = async () => {
    if (confirm('هل تريد مسح جميع البيانات المخزنة؟ (يمكنك استعادتها من الإنترنت)')) {
      await clearAllCaches();
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-yellow-800">
          ℹ️ Service Workers غير مدعوم في هذا المتصفح
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border ${
        isOnline
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      } p-4 ${className}`}
    >
      {/* حالة الاتصال */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">متصل بالإنترنت</p>
              <p className="text-sm text-green-700">البيانات تُحدّث تلقائياً</p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 text-red-600 animate-pulse" />
            <div>
              <p className="font-semibold text-red-900">بدون اتصال</p>
              <p className="text-sm text-red-700">العمل على البيانات المخزنة</p>
            </div>
          </>
        )}
      </div>

      {/* معلومات الـ Cache */}
      {!loading && summary ? (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">التخزين المؤقت</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {summary.totalSize}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {summary.totalItems} عنصر مخزن
            </p>

            {/* تفاصيل الـ Cache */}
            {showDetails && summary.caches.length > 0 && (
              <div className="mt-3 space-y-2">
                {summary.caches.map((cache) => (
                  <div
                    key={cache.name}
                    className="bg-white rounded p-2 text-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">
                        {getCacheName(cache.name)}
                      </span>
                      <span className="text-gray-600">{cache.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getCacheColor(cache.name)}`}
                          style={{
                            width: `${cache.percentage}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {cache.items} عنصر
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* زر التحديث */}
          <button
            onClick={refreshCache}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm mb-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث معلومات الـ Cache
          </button>

          {/* أزرار التنظيف */}
          {showDetails && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button
                  onClick={clearMapsCache}
                  className="px-2 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  حذف الخرائط
                </button>
                <button
                  onClick={clearImagesCache}
                  className="px-2 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  حذف الصور
                </button>
                <button
                  onClick={clearJsonCache}
                  className="px-2 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  حذف البيانات
                </button>
                <button
                  onClick={clearPdfsCache}
                  className="px-2 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  حذف الملفات
                </button>
              </div>

              <button
                onClick={handleClearAll}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
              >
                <Trash2 className="w-4 h-4" />
                مسح جميع البيانات المخزنة
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-sm text-gray-600">جاري تحميل معلومات الـ Cache...</div>
      )}

      {/* ملاحظات */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
        <p>
          <strong>📌 ملاحظة:</strong> البيانات المخزنة تساعدك على العمل بدون إنترنت
          وتسريع تحميل الصفحات. يمكن مسحها في أي وقت.
        </p>
      </div>
    </div>
  );
}

/**
 * الحصول على اسم الـ Cache المناسب
 */
function getCacheName(name: string): string {
  const names: Record<string, string> = {
    'port-navigator-maps': '🗺️ الخرائط',
    'port-navigator-images': '🖼️ الصور',
    'port-navigator-json': '📊 البيانات',
    'port-navigator-pdfs': '📄 الملفات',
    'port-navigator-v1': '⚙️ الأصول الأساسية',
    'port-navigator-runtime': '⚡ بيانات التطبيق',
  };

  return names[name] || name;
}

/**
 * الحصول على لون الـ Cache
 */
function getCacheColor(name: string): string {
  const colors: Record<string, string> = {
    'port-navigator-maps': 'bg-green-500',
    'port-navigator-images': 'bg-blue-500',
    'port-navigator-json': 'bg-yellow-500',
    'port-navigator-pdfs': 'bg-purple-500',
    'port-navigator-v1': 'bg-gray-500',
    'port-navigator-runtime': 'bg-orange-500',
  };

  return colors[name] || 'bg-gray-500';
}
