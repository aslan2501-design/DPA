/**
 * useCacheManager: Hook لإدارة Service Worker و Cache
 * يوفر معلومات الـ Cache والتحكم به
 */

import { useState, useEffect, useCallback } from 'react';
import { CacheManager } from '@/lib/CacheManager';

export interface CacheItem {
  name: string;
  size: string;
  sizeBytes: number;
  items: number;
  percentage: number | string;
}

export interface CacheSummary {
  totalSize: string;
  totalSizeBytes: number;
  totalItems: number;
  caches: CacheItem[];
}

interface UseCacheManagerReturn {
  summary: CacheSummary | null;
  loading: boolean;
  error: Error | null;
  isSupported: boolean;
  isOnline: boolean;
  refreshCache: () => Promise<void>;
  clearCache: (cacheName: string) => Promise<boolean>;
  clearAllCaches: () => Promise<boolean>;
  clearMapsCache: () => Promise<boolean>;
  clearImagesCache: () => Promise<boolean>;
  clearJsonCache: () => Promise<boolean>;
  clearPdfsCache: () => Promise<boolean>;
  getServiceWorkerStatus: () => Promise<boolean>;
}

export function useCacheManager(): UseCacheManagerReturn {
  const [summary, setSummary] = useState<CacheSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const isSupported = CacheManager.isServiceWorkerSupported();

  // تحديث معلومات الـ Cache
  const refreshCache = useCallback(async () => {
    try {
      setLoading(true);
      const newSummary = await CacheManager.getCacheSummary();
      setSummary(newSummary);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh cache'));
    } finally {
      setLoading(false);
    }
  }, []);

  // تحميل معلومات الـ Cache عند التركيب
  useEffect(() => {
    refreshCache();

    // تحديث كل 10 ثوان
    const interval = setInterval(refreshCache, 10000);

    return () => clearInterval(interval);
  }, [refreshCache]);

  // الاستماع لتغييرات حالة الاتصال
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // مسح cache محدد
  const clearCache = useCallback(
    async (cacheName: string): Promise<boolean> => {
      try {
        const success = await CacheManager.clearCache(cacheName);
        await refreshCache();
        return success;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to clear cache'));
        return false;
      }
    },
    [refreshCache]
  );

  // مسح جميع الـ Caches
  const clearAllCaches = useCallback(async (): Promise<boolean> => {
    try {
      const success = await CacheManager.clearAllCaches();
      await refreshCache();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear caches'));
      return false;
    }
  }, [refreshCache]);

  // مسح cache الخرائط
  const clearMapsCache = useCallback(async (): Promise<boolean> => {
    return clearCache('port-navigator-maps');
  }, [clearCache]);

  // مسح cache الصور
  const clearImagesCache = useCallback(async (): Promise<boolean> => {
    return clearCache('port-navigator-images');
  }, [clearCache]);

  // مسح cache JSON
  const clearJsonCache = useCallback(async (): Promise<boolean> => {
    return clearCache('port-navigator-json');
  }, [clearCache]);

  // مسح cache PDF
  const clearPdfsCache = useCallback(async (): Promise<boolean> => {
    return clearCache('port-navigator-pdfs');
  }, [clearCache]);

  // الحصول على حالة Service Worker
  const getServiceWorkerStatus = useCallback(async (): Promise<boolean> => {
    try {
      const registration = CacheManager.getRegistration();
      return registration != null;
    } catch {
      return false;
    }
  }, []);

  return {
    summary,
    loading,
    error,
    isSupported,
    isOnline,
    refreshCache,
    clearCache,
    clearAllCaches,
    clearMapsCache,
    clearImagesCache,
    clearJsonCache,
    clearPdfsCache,
    getServiceWorkerStatus,
  };
}
