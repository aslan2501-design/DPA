/**
 * useStorageMonitor: Hook لمراقبة وإدارة مساحة التخزين
 * يوفر معلومات فورية عن استخدام localStorage و IndexedDB
 */

import { useState, useEffect, useCallback } from 'react';
import { AdvancedStorageService, StorageStats } from '@/lib/AdvancedStorageService';

interface UseStorageMonitorReturn {
  stats: StorageStats | null;
  loading: boolean;
  error: Error | null;
  refreshStats: () => Promise<void>;
  cleanup: (daysToKeep?: number) => Promise<number>;
  export: () => Promise<string>;
  import: (jsonData: string) => Promise<void>;
  isStorageFull: boolean;
  storageWarning: 'none' | 'warning' | 'critical';
  getRemainingSpace: () => {
    localStorage: number;
    indexedDB: number;
  };
}

export function useStorageMonitor(): UseStorageMonitorReturn {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // تحديث الإحصائيات
  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      const newStats = await AdvancedStorageService.getStorageStats();
      setStats(newStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get storage stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  // تحميل الإحصائيات عند التركيب
  useEffect(() => {
    refreshStats();

    // تحديث كل 5 دقائق
    const interval = setInterval(refreshStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshStats]);

  // تنظيف البيانات القديمة
  const cleanup = useCallback(
    async (daysToKeep: number = 90): Promise<number> => {
      try {
        const deletedCount = await AdvancedStorageService.autoCleanup(daysToKeep);
        await refreshStats();
        return deletedCount;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Cleanup failed'));
        return 0;
      }
    },
    [refreshStats]
  );

  // تصدير البيانات
  const exportData = useCallback(async (): Promise<string> => {
    try {
      return await AdvancedStorageService.exportData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Export failed'));
      return '';
    }
  }, []);

  // استيراد البيانات
  const importData = useCallback(
    async (jsonData: string): Promise<void> => {
      try {
        await AdvancedStorageService.importData(jsonData);
        await refreshStats();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Import failed'));
        throw err;
      }
    },
    [refreshStats]
  );

  // هل التخزين ممتلئ؟
  const isStorageFull =
    stats && (stats.localStorageUsage >= 95 || stats.indexedDBUsage >= 95);

  // مستوى التحذير
  const storageWarning: 'none' | 'warning' | 'critical' = !stats
    ? 'none'
    : stats.localStorageUsage >= 90 || stats.indexedDBUsage >= 90
      ? 'critical'
      : stats.localStorageUsage >= 75 || stats.indexedDBUsage >= 75
        ? 'warning'
        : 'none';

  // حساب المساحة المتبقية
  const getRemainingSpace = useCallback(() => {
    return {
      localStorage: stats
        ? Math.max(0, 100 * 1024 * 1024 - stats.localStorageSize)
        : 100 * 1024 * 1024,
      indexedDB: stats
        ? Math.max(0, 300 * 1024 * 1024 - stats.indexedDBSize)
        : 300 * 1024 * 1024,
    };
  }, [stats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    cleanup,
    export: exportData,
    import: importData,
    isStorageFull: !!isStorageFull,
    storageWarning,
    getRemainingSpace,
  };
}
