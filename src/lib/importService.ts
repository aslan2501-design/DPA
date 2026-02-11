import { z } from 'zod';
import { StorageService } from './StorageService';
import { Request } from '@/contexts/DataContext';

// نوع الطلب
export interface ShipRequest {
  id?: string;
  type: 'ship';
  vesselName: string;
  imo?: string;
  callSign?: string;
  eta: string; // ISO date
  berthRequested: string;
  cargoType?: string;
  weight?: number;
  contactName: string;
  contactPhone?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  createdAt?: string;
}

export interface WarehouseRequest {
  id?: string;
  type: 'warehouse';
  warehouseId: string;
  startDate: string;
  endDate: string;
  goodsType?: string;
  quantity?: number;
  dimensions?: string;
  ownerName: string;
  ownerPhone?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export type ImportRequest = ShipRequest | WarehouseRequest;

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: Array<{ row: number; message: string; data?: any }>;
  warnings: string[];
  importId?: string;
  createdAt?: string;
}

export interface ImportLog {
  id: string;
  fileName: string;
  totalRows: number;
  successCount: number;
  failedCount: number;
  timestamp: string;
  userId?: string;
  status: 'success' | 'partial' | 'failed';
  errors: Array<{ row: number; message: string }>;
}

// Zod schemas للتحقق
const ShipRequestSchema = z.object({
  type: z.literal('ship'),
  vesselName: z.string().min(1, 'اسم السفينة مطلوب'),
  imo: z.string().optional(),
  callSign: z.string().optional(),
  eta: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'تاريخ الوصول غير صحيح'
  ),
  berthRequested: z.string().min(1, 'النحر المطلوب مطلوب'),
  cargoType: z.string().optional(),
  weight: z.coerce.number().optional(),
  contactName: z.string().min(1, 'اسم جهة الاتصال مطلوب'),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

const WarehouseRequestSchema = z.object({
  type: z.literal('warehouse'),
  warehouseId: z.string().min(1, 'رقم المخزن مطلوب'),
  startDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'تاريخ البدء غير صحيح'
  ),
  endDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'تاريخ الانتهاء غير صحيح'
  ),
  goodsType: z.string().optional(),
  quantity: z.coerce.number().optional(),
  dimensions: z.string().optional(),
  ownerName: z.string().min(1, 'اسم المالك مطلوب'),
  ownerPhone: z.string().optional(),
  notes: z.string().optional(),
});

export class ImportService {
  /**
   * معالجة وحفظ الطلبات المستوردة
   */
  static async importRequests(rows: any[], fileName?: string): Promise<ImportResult> {
    const errors: Array<{ row: number; message: string; data?: any }> = [];
    const warnings: string[] = [];
    const successfulRequests: ImportRequest[] = [];

    // معالجة كل صف
    rows.forEach((row, index) => {
      try {
        // تحويل مفاتيح الصفوف إلى snake_case/camelCase
        const normalized = this.normalizeRow(row);

        if (!normalized.type) {
          errors.push({
            row: index + 2,
            message: 'نوع الطلب (Type) مطلوب',
            data: row,
          });
          return;
        }

        // التحقق بناءً على النوع
        let validatedRequest: ImportRequest;
        if (normalized.type === 'ship') {
          const result = ShipRequestSchema.safeParse(normalized);
          if (!result.success) {
            const messages = result.error.errors
              .map((e) => `${e.path.join('.')}: ${e.message}`)
              .join('; ');
            errors.push({
              row: index + 2,
              message: messages,
              data: row,
            });
            return;
          }
          validatedRequest = {
            ...result.data,
            id: normalized.requestId || `ship-${Date.now()}-${index}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
          } as ShipRequest;
        } else if (normalized.type === 'warehouse') {
          const result = WarehouseRequestSchema.safeParse(normalized);
          if (!result.success) {
            const messages = result.error.errors
              .map((e) => `${e.path.join('.')}: ${e.message}`)
              .join('; ');
            errors.push({
              row: index + 2,
              message: messages,
              data: row,
            });
            return;
          }
          validatedRequest = {
            ...result.data,
            id: normalized.requestId || `warehouse-${Date.now()}-${index}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
          } as WarehouseRequest;
        } else {
          warnings.push(`نوع غير معروف '${normalized.type}' في الصف ${index + 2}`);
          return;
        }

        successfulRequests.push(validatedRequest);
      } catch (err: any) {
        errors.push({
          row: index + 2,
          message: err.message || 'خطأ في معالجة الصف',
          data: row,
        });
      }
    });

    // حفظ الطلبات الناجحة
    const currentData = StorageService.getData();

    // تحويل الطلبات الجديدة إلى نموذج Request
    const newFormattedRequests: Request[] = successfulRequests.map((req) => {
      if (req.type === 'ship') {
        const shipReq = req as ShipRequest;
        return {
          id: req.id!,
          type: 'trolley',
          title: shipReq.vesselName,
          status: 'pending',
          date: shipReq.eta || new Date().toISOString(),
          details: shipReq.notes || `ETA: ${shipReq.eta}`,
          vesselName: shipReq.vesselName,
          cargoType: shipReq.cargoType,
          quantity: shipReq.weight?.toString(),
          shippingAgent: shipReq.contactName,
        } as Request;
      } else {
        const whReq = req as WarehouseRequest;
        return {
          id: req.id!,
          type: 'warehouse',
          title: whReq.warehouseId,
          status: 'pending',
          date: whReq.startDate,
          details: whReq.notes || `From ${whReq.startDate} to ${whReq.endDate}`,
          fromDate: whReq.startDate,
          toDate: whReq.endDate,
          owner: whReq.ownerName,
          cargoType: whReq.goodsType,
          quantity: whReq.quantity?.toString(),
        } as Request;
      }
    });

    const mergedRequests = [
      ...currentData.requests,
      ...newFormattedRequests,
    ];

    StorageService.saveData({
      requests: mergedRequests,
    });

    // إنشاء سجل الاستيراد
    const importLog: ImportLog = {
      id: `import-${Date.now()}`,
      fileName: fileName || 'Unknown',
      totalRows: rows.length,
      successCount: successfulRequests.length,
      failedCount: errors.length,
      timestamp: new Date().toISOString(),
      status: errors.length === 0 ? 'success' : errors.length >= successfulRequests.length ? 'failed' : 'partial',
      errors: errors as any,
    };

    // حفظ سجل الاستيراد
    const importLogs = this.getImportLogs();
    importLogs.push(importLog);
    localStorage.setItem('port-navigator-import-logs', JSON.stringify(importLogs));

    return {
      success: errors.length === 0,
      totalRows: rows.length,
      successCount: successfulRequests.length,
      failedCount: errors.length,
      errors,
      warnings,
      importId: importLog.id,
      createdAt: importLog.timestamp,
    };
  }

  /**
   * تحويل مفاتيح الصف من أشكال مختلفة إلى camelCase
   */
  private static normalizeRow(row: any): any {
    const normalized: any = {};

    Object.keys(row).forEach((key) => {
      const lowerKey = key.toLowerCase().trim();
      const camelKey = lowerKey
        .replace(/[_-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (c) => c.toLowerCase());

      // مطابقة مفاتيح شائعة بصراحة
      let finalKey = camelKey;
      if (['type', 'requestid', 'vesselname', 'imo', 'callsign', 'eta', 'berthRequested', 'cargotype', 'weight', 'contactname', 'contactphone', 'notes', 'latitude', 'longitude', 'warehouseid', 'startdate', 'enddate', 'goodstype', 'quantity', 'dimensions', 'ownername', 'ownerphone'].includes(camelKey)) {
        finalKey = camelKey;
      }

      if (row[key] !== null && row[key] !== undefined && row[key] !== '') {
        normalized[finalKey] = row[key];
      }
    });

    return normalized;
  }

  /**
   * الحصول على سجلات الاستيراد السابقة
   */
  static getImportLogs(): ImportLog[] {
    try {
      const logs = localStorage.getItem('port-navigator-import-logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * إنشاء ملف CSV للأخطاء
   */
  static generateErrorReport(
    result: ImportResult
  ): string {
    if (result.errors.length === 0) return '';

    const headers = ['Row', 'Error', 'Data'];
    const rows = result.errors.map((err) => [
      err.row,
      err.message,
      err.data ? JSON.stringify(err.data) : '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(',')
      ),
    ].join('\n');

    return csv;
  }

  /**
   * تنزيل ملف CSV
   */
  static downloadErrorFile(csv: string, fileName: string = 'import-errors.csv'): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default ImportService;
