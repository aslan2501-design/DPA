/**
 * مثال على كيفية استخدام مكوّن ExcelImporter
 * 
 * يمكنك إضافة هذا المكوّن إلى أي صفحة تريدها باتباع الخطوات التالية:
 */

import React from "react";
import ExcelImporter from "@/components/ExcelImporter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExcelImporterExample() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* الجانب الأيسر - المكوّن */}
        <div className="md:col-span-2">
          <ExcelImporter />
        </div>

        {/* الجانب الأيمن - معلومات مساعدة */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إرشادات الاستخدام</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <strong className="block mb-1">✓ الخطوة 1: اختر الملف</strong>
                <p className="text-gray-600">
                  حمّل ملف Excel أو CSV يحتوي على بيانات الطلبات
                </p>
              </div>
              <div>
                <strong className="block mb-1">✓ الخطوة 2: فحص جاف</strong>
                <p className="text-gray-600">
                  انقر على "فحص جاف" للتحقق من البيانات قبل الاستيراد
                </p>
              </div>
              <div>
                <strong className="block mb-1">✓ الخطوة 3: استيراد</strong>
                <p className="text-gray-600">
                  إذا نجح الفحص، انقر "استيراد الآن" لحفظ البيانات
                </p>
              </div>
              <div>
                <strong className="block mb-1">✓ الخطوة 4: الأخطاء</strong>
                <p className="text-gray-600">
                  إذا كانت هناك أخطاء، يمكنك تنزيل تقرير وتصحيح الملف
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">متطلبات الملف</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>العمود الأساسي:</strong> <code className="bg-gray-100 px-1">Type</code>
              </p>
              <p>
                <strong>القيم المسموحة:</strong> <code className="bg-gray-100 px-1">ship</code> أو <code className="bg-gray-100 px-1">warehouse</code>
              </p>
              <p>
                <strong>الصيغة المدعومة:</strong> Excel, CSV, XLS
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الأخطاء الشائعة</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-gray-600">
              <p>❌ "نوع الطلب مطلوب" - العمود Type غير موجود أو فارغ</p>
              <p>❌ "تاريخ غير صحيح" - تأكد من صيغة التاريخ ISO</p>
              <p>❌ "حقل مطلوب" - تحقق من الأعمدة الإلزامية</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * كيفية إضافة المكوّن إلى صفحة موجودة:
 * 
 * 1. استيراد المكوّن:
 *    import ExcelImporter from "@/components/ExcelImporter";
 * 
 * 2. إضافة المكوّن في JSX:
 *    <ExcelImporter />
 * 
 * 3. مثال كامل:
 *    
 *    export default function MyPage() {
 *      return (
 *        <div>
 *          <h1>صفحتي</h1>
 *          <ExcelImporter />
 *        </div>
 *      );
 *    }
 * 
 * 4. المكوّن يتعامل مع كل شيء تلقائياً:
 *    - قراءة الملف
 *    - التحقق من البيانات
 *    - حفظ الطلبات
 *    - عرض الأخطاء والتحذيرات
 *    - تنزيل تقرير الأخطاء
 */
