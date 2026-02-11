import React, { useState } from 'react';
import { BarChart3, Trash2, Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStorageMonitor } from '@/hooks/useStorageMonitor';

interface StorageMonitorPanelProps {
  className?: string;
}

export function StorageMonitorPanel({ className = '' }: StorageMonitorPanelProps) {
  const { stats, loading, storageWarning, cleanup, export: exportData, import: importData, getRemainingSpace } = useStorageMonitor();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatPercent = (value: number) => {
    return Math.round(value * 100) / 100;
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const data = await exportData();
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', `port-navigator-backup-${new Date().toISOString().split('T')[0]}.json`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      setImporting(true);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const text = await file.text();
          await importData(text);
          alert('تم استيراد البيانات بنجاح');
        }
      };
      input.click();
    } catch (error) {
      alert('خطأ في استيراد البيانات: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImporting(false);
    }
  };

  const handleCleanup = async () => {
    if (confirm('هل تريد حذف البيانات القديمة؟')) {
      const deleted = await cleanup(90);
      alert(`تم حذف ${deleted} عنصر قديم`);
    }
  };

  const remainingSpace = getRemainingSpace();

  if (loading) {
    return (
      <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
        <div className="animate-pulse text-gray-500">جاري تحميل معلومات التخزين...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const warningColor = {
    critical: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    none: 'text-green-600 bg-green-50 border-green-200',
  };

  return (
    <div className={`${warningColor[storageWarning]} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <h3 className="font-semibold">مراقبة التخزين</h3>
        </div>
        {storageWarning !== 'none' && <AlertTriangle className="w-5 h-5" />}
      </div>

      {/* localStorage */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">localStorage</span>
          <span className="text-sm">
            {formatBytes(stats.localStorageSize)} / 100 MB
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(stats.localStorageUsage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          المساحة المتبقية: {formatBytes(remainingSpace.localStorage)}
        </div>
      </div>

      {/* IndexedDB */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">IndexedDB</span>
          <span className="text-sm">
            {formatBytes(stats.indexedDBSize)} / 300 MB
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(stats.indexedDBUsage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          المساحة المتبقية: {formatBytes(remainingSpace.indexedDB)}
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="text-xs text-gray-600 mb-4 grid grid-cols-2 gap-2">
        <div>
          <span className="font-medium">الطلبات:</span> {stats.itemCount.requests}
        </div>
        <div>
          <span className="font-medium">الشكاوى:</span> {stats.itemCount.complaints}
        </div>
        <div>
          <span className="font-medium">المخازن:</span> {stats.itemCount.warehouses}
        </div>
        <div>
          <span className="font-medium">الضغط:</span> {stats.compressionRatio}%
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCleanup}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
        >
          <Trash2 className="w-4 h-4" />
          تنظيف البيانات القديمة
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'جاري التصدير...' : 'حفظ البيانات'}
          </button>

          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {importing ? 'جاري الاستيراد...' : 'استعادة البيانات'}
          </button>
        </div>
      </div>

      {/* تحذير */}
      {storageWarning === 'critical' && (
        <div className="mt-3 p-2 bg-red-100 rounded text-xs">
          ⚠️ التخزين امتلأ تقريباً! يرجى حذف البيانات القديمة.
        </div>
      )}
      {storageWarning === 'warning' && (
        <div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
          ⚠️ التخزين قريب من الامتلاء. يُنصح بحذف البيانات القديمة.
        </div>
      )}
    </div>
  );
}
