import React, { useState } from "react";
import * as XLSX from "xlsx";
import ImportService, { ImportResult } from "@/lib/importService";
import { toast } from "sonner";

export default function ExcelImporter() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  function readFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
        const cols = (XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || []) as string[];
        setColumns(cols);
        setPreview((json as any[]).slice(0, 50));
        setImportResult(null);
      } catch (err: any) {
        toast.error("فشل قراءة الملف: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleImport(dryRun = true) {
    if (!fileName) {
      toast.error("الرجاء اختيار ملف أولاً");
      return;
    }
    setProcessing(true);
    try {
      // قراءة الملف مرة أخرى
      const input = document.getElementById("excel-input") as HTMLInputElement | null;
      const file = input?.files?.[0];
      if (!file) return;
      
      const array = await file.arrayBuffer();
      const workbook = XLSX.read(array, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: null }) as any[];

      if (dryRun) {
        // اختبار جاف - تشغيل التحقق فقط
        const result = await ImportService.importRequests(json, fileName);
        setImportResult(result);
        if (result.success) {
          toast.success(`✓ الفحص نجح - ${result.totalRows} صف، ${result.successCount} صف صحيح`);
        } else {
          toast.warning(`⚠ وجدت ${result.failedCount} أخطاء من ${result.totalRows} صف`);
        }
        return;
      }

      // استيراد فعلي
      const result = await ImportService.importRequests(json, fileName);
      setImportResult(result);

      if (result.success) {
        toast.success(`✓ تم استيراد ${result.successCount} طلب بنجاح`);
      } else if (result.failedCount > 0 && result.successCount > 0) {
        toast.warning(`⚠ تم استيراد ${result.successCount} طلب وفشل ${result.failedCount} آخر`);
        if (result.errors.length > 0) {
          const csv = ImportService.generateErrorReport(result);
          ImportService.downloadErrorFile(csv, `errors-${Date.now()}.csv`);
        }
      } else {
        toast.error("فشل الاستيراد - توجد أخطاء في جميع الصفوف");
        if (result.errors.length > 0) {
          const csv = ImportService.generateErrorReport(result);
          ImportService.downloadErrorFile(csv, `errors-${Date.now()}.csv`);
        }
      }
    } catch (err: any) {
      toast.error("خطأ في المعالجة: " + err.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">استيراد الطلبات من ملف Excel</h3>
        <p className="text-sm text-gray-600">
          اختر ملف Excel أو CSV يحتوي على طلبات تراكى السفن أو طلبات المخازن
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">اختر ملفك</label>
        <input
          id="excel-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) readFile(f);
          }}
        />
      </div>

      {fileName && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>الملف:</strong> {fileName}
          </p>
        </div>
      )}

      {columns.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">الأعمدة المكتشفة:</div>
          <div className="flex flex-wrap gap-2">
            {columns.map((c) => (
              <span
                key={c}
                className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-medium text-gray-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {importResult && (
        <div className="mb-4 p-4 rounded border">
          {importResult.success ? (
            <div className="bg-green-50 border-green-200 border">
              <p className="text-green-800 font-semibold">✓ نجاح الاستيراد</p>
              <p className="text-sm text-green-700 mt-1">
                تم استيراد {importResult.successCount} من {importResult.totalRows} صف
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border-red-200 border">
              <p className="text-red-800 font-semibold">✗ فشل الاستيراد</p>
              <p className="text-sm text-red-700 mt-1">
                {importResult.failedCount} أخطاء من {importResult.totalRows} صف
              </p>
            </div>
          )}

          {importResult.warnings.length > 0 && (
            <div className="mt-3 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
              <strong className="text-sm">تحذيرات:</strong>
              <ul className="list-disc ml-5 mt-1">
                {importResult.warnings.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-sm">{w}</li>
                ))}
                {importResult.warnings.length > 3 && (
                  <li className="text-sm">و {importResult.warnings.length - 3} تحذير آخر</li>
                )}
              </ul>
            </div>
          )}

          {importResult.errors.length > 0 && (
            <div className="mt-3 text-red-700 bg-red-50 border border-red-200 rounded p-2 max-h-48 overflow-auto">
              <strong className="text-sm block mb-2">الأخطاء ({importResult.errors.length}):</strong>
              <ul className="text-xs space-y-1">
                {importResult.errors.slice(0, 10).map((e, i) => (
                  <li key={i}>
                    <span className="font-medium">الصف {e.row}:</span> {e.message}
                  </li>
                ))}
                {importResult.errors.length > 10 && (
                  <li className="font-medium">و {importResult.errors.length - 10} أخطاء أخرى...</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {preview.length > 0 && !importResult && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            معاينة (أول {preview.length} صف)
          </div>
          <div className="overflow-auto max-h-60 border rounded border-gray-300">
            <table className="min-w-full text-xs bg-white">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border-b text-left font-semibold text-gray-700">#</th>
                  {Object.keys(preview[0] || {}).map((k) => (
                    <th
                      className="p-2 border-b text-left font-semibold text-gray-700 whitespace-nowrap"
                      key={k}
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border-b text-gray-600 font-medium">{i + 1}</td>
                    {Object.keys(r).map((k) => (
                      <td className="p-2 border-b text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs" key={k + i}>
                        {String(r[k] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handleImport(true)}
          disabled={processing || !fileName}
        >
          {processing ? "جاري الفحص..." : "فحص جاف"}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
          onClick={() => handleImport(false)}
          disabled={processing || !fileName || (importResult?.failedCount ?? 0) > 0}
        >
          {processing ? "جاري الاستيراد..." : "استيراد الآن"}
        </button>
        <a
          href="/templates/requests_template.csv"
          download
          className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700"
        >
          تنزيل القالب
        </a>
      </div>
    </div>
  );
}
