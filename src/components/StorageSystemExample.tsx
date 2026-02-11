/**
 * مثال عملي: استخدام نظام التخزين الهجين المتقدم
 * في صفحة الإدارة والإعدادات
 */

import React, { useState } from 'react';
import { useStorageMonitor } from '@/hooks/useStorageMonitor';
import { AdvancedStorageService } from '@/lib/AdvancedStorageService';
import { StorageMonitorPanel } from '@/components/StorageMonitorPanel';

interface StorageExampleProps {
  title?: string;
}

export function StorageSystemExample({ title = 'Storage System Demo' }: StorageExampleProps) {
  const {
    stats,
    loading,
    error,
    refreshStats,
    cleanup,
    export: exportData,
    import: importData,
    getRemainingSpace,
  } = useStorageMonitor();

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('ar-EG');
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleAddSampleRequest = async () => {
    try {
      const request = {
        id: `req-${Date.now()}`,
        userId: 'user-123',
        type: 'warehouse' as const,
        title: 'طلب تجريبي',
        status: 'pending' as const,
        date: new Date().toISOString().split('T')[0],
        details: 'طلب تجريبي لاختبار النظام',
      };

      await AdvancedStorageService.addRequest(request);
      addLog(`✅ تم إضافة طلب: ${request.id}`);
      await refreshStats();
    } catch (error) {
      addLog(`❌ خطأ: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleAddSampleComplaint = async () => {
    try {
      const complaint = {
        id: `comp-${Date.now()}`,
        userId: 'user-123',
        createdBy: 'user-123',
        title: 'شكوى تجريبية',
        faultType: 'تقني',
        priority: 'high' as const,
        status: 'pending' as const,
        location: 'الرصيف 1',
        date: new Date().toISOString().split('T')[0],
        description: 'شكوى تجريبية لاختبار النظام',
      };

      await AdvancedStorageService.addComplaint(complaint);
      addLog(`✅ تم إضافة شكوى: ${complaint.id}`);
      await refreshStats();
    } catch (error) {
      addLog(`❌ خطأ: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleAddSampleMapData = async () => {
    try {
      const mapData = {
        type: 'FeatureCollection',
        features: Array.from({ length: 100 }).map((_, i) => ({
          type: 'Feature',
          id: i,
          geometry: {
            type: 'Point',
            coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90],
          },
          properties: {
            name: `Warehouse ${i}`,
            capacity: Math.random() * 10000,
          },
        })),
      };

      await AdvancedStorageService.saveMapData('sample-map', mapData);
      addLog(`✅ تم حفظ بيانات الخريطة (مع الضغط)`);
      await refreshStats();
    } catch (error) {
      addLog(`❌ خطأ: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleLoadAllData = async () => {
    try {
      addLog('⏳ جاري تحميل البيانات...');
      const requests = await AdvancedStorageService.getRequests();
      const complaints = await AdvancedStorageService.getComplaints();

      addLog(`📊 تم تحميل ${requests.length} طلب و ${complaints.length} شكوى`);
      await refreshStats();
    } catch (error) {
      addLog(`❌ خطأ: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleCleanup = async () => {
    try {
      addLog('⏳ جاري تنظيف البيانات القديمة...');
      const deleted = await cleanup(90);
      addLog(`✅ تم حذف ${deleted} عنصر قديم`);
    } catch (error) {
      addLog(`❌ خطأ: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleExport = async () => {
    try {
      addLog('⏳ جاري تصدير البيانات...');
      const data = await exportData();
      
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
      );
      element.setAttribute(
        'download',
        `backup-${new Date().toISOString().split('T')[0]}.json`
      );
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      addLog('✅ تم تصدير البيانات بنجاح');
    } catch (error) {
      addLog(`❌ خطأ: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🎯 {title}</h2>

      {/* لوحة مراقبة التخزين */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">📊 مراقبة التخزين</h3>
        <StorageMonitorPanel />
      </section>

      {/* الإحصائيات التفصيلية */}
      {!loading && stats && (
        <section className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">📈 الإحصائيات التفصيلية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">localStorage:</span>
              <div className="text-blue-600">
                {formatBytes(stats.localStorageSize)} / 100 MB
              </div>
              <div className="text-xs text-gray-500">
                {stats.localStorageUsage.toFixed(1)}% مستخدم
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">IndexedDB:</span>
              <div className="text-purple-600">
                {formatBytes(stats.indexedDBSize)} / 300 MB
              </div>
              <div className="text-xs text-gray-500">
                {stats.indexedDBUsage.toFixed(1)}% مستخدم
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">إجمالي:</span>
              <div className="text-green-600">
                {formatBytes(stats.totalSize)} / 400 MB
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">نسبة الضغط:</span>
              <div className="text-orange-600">{stats.compressionRatio}%</div>
              <div className="text-xs text-gray-500">
                توفير من المساحة
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">عدد الطلبات:</span>
              <div className="text-blue-600">{stats.itemCount.requests}</div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">عدد الشكاوى:</span>
              <div className="text-red-600">{stats.itemCount.complaints}</div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">عدد المخازن:</span>
              <div className="text-green-600">{stats.itemCount.warehouses}</div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-medium">آخر مزامنة:</span>
              <div className="text-xs text-gray-600">
                {new Date(stats.lastSync).toLocaleString('ar-EG')}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* أدوات الاختبار */}
      <section className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-4">🧪 أدوات الاختبار</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleAddSampleRequest}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          >
            ➕ إضافة طلب تجريبي
          </button>

          <button
            onClick={handleAddSampleComplaint}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
          >
            ➕ إضافة شكوى تجريبية
          </button>

          <button
            onClick={handleAddSampleMapData}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
          >
            📍 إضافة بيانات خريطة
          </button>

          <button
            onClick={handleLoadAllData}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition text-sm"
          >
            📂 تحميل جميع البيانات
          </button>

          <button
            onClick={handleCleanup}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-sm"
          >
            🧹 تنظيف البيانات القديمة
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition text-sm"
          >
            💾 تصدير البيانات
          </button>

          <button
            onClick={() => refreshStats()}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition text-sm"
          >
            🔄 تحديث الإحصائيات
          </button>
        </div>
      </section>

      {/* السجل */}
      <section>
        <h3 className="text-lg font-semibold mb-4">📝 سجل العمليات</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">في انتظار العمليات...</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </section>

      {/* ملاحظات */}
      <section className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">⚡ ملاحظات مهمة:</h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>جميع البيانات تُحفظ محلياً في المتصفح</li>
          <li>localStorage يدعم حتى 100 MB من البيانات</li>
          <li>IndexedDB يدعم حتى 300 MB من البيانات</li>
          <li>البيانات الكبيرة تُضغط تلقائياً (توفير 40-60%)</li>
          <li>البحث سريع عبر الفهارس التلقائية</li>
          <li>يمكن تصدير واستيراد البيانات بسهولة</li>
        </ul>
      </section>
    </div>
  );
}

export default StorageSystemExample;
