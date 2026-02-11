# دليل دمج مكوّن ExcelImporter

## الملفات المضافة

### 1. **`src/components/ExcelImporter.tsx`**
المكوّن الرئيسي لرفع واستيراد الملفات

### 2. **`src/lib/importService.ts`**
خدمة معالجة الاستيراد والتحقق من البيانات

### 3. **`public/templates/requests_template.csv`**
قالب مثال للمستخدمين

### 4. **`IMPORT_GUIDE.md`**
دليل شامل لصيغ الملفات والأخطاء الشائعة

## كيفية الدمج السريع

### إضافة إلى صفحة `Requests.tsx`

#### الخطوة 1: الاستيراد
```typescript
import ExcelImporter from '@/components/ExcelImporter';
```

#### الخطوة 2: إضافة زر في الحوار أو القائمة
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button className="gap-2">
      <Upload className="w-4 h-4" />
      استيراد من Excel
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>استيراد الطلبات من ملف Excel</DialogTitle>
      <DialogDescription>
        رفع ملف Excel أو CSV يحتوي على طلبات جديدة
      </DialogDescription>
    </DialogHeader>
    <ExcelImporter />
  </DialogContent>
</Dialog>
```

#### الخطوة 3: إضافة الأيقونة (إن لم تكن موجودة)
```bash
# إذا كنت بحاجة لأيقونة Upload:
# lucide-react يحتويها بالفعل
import { Upload } from 'lucide-react';
```

## كيفية التشغيل

### 1. تثبيت الحزم (تم بالفعل)
```bash
npm install xlsx
```

### 2. تشغيل المشروع
```bash
npm run dev
```

### 3. الوصول إلى المكوّن
- إذا أضفته إلى `Requests.tsx`: سيظهر عند فتح حوار الاستيراد
- أو قم بزيارة `/excel-import-example` إن كنت ملاحظاً من التوجيه

## الميزات الرئيسية

✅ **رفع وقراءة** ملفات Excel/CSV
✅ **معاينة** البيانات قبل الاستيراد
✅ **التحقق** من صحة البيانات تلقائياً
✅ **فحص جاف** (Dry run) لاختبار بدون حفظ
✅ **تقارير أخطاء** قابلة للتنزيل
✅ **قالب مثال** جاهز للتحميل
✅ **حفظ تلقائي** في `localStorage`
✅ **سجل الاستيراد** للمراجعة

## مثال الاستخدام الكامل

```tsx
import { useState } from 'react';
import ExcelImporter from '@/components/ExcelImporter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function RequestsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button>إضافة طلب جديد</Button>
        
        {/* زر الاستيراد */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              استيراد من Excel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>استيراد الطلبات</DialogTitle>
            </DialogHeader>
            <ExcelImporter />
          </DialogContent>
        </Dialog>
      </div>

      {/* باقي المحتوى */}
    </div>
  );
}
```

## استكشاف الأخطاء

### أخطاء شائعة:

**❌ "Cannot find module 'xlsx'"**
```bash
# الحل:
npm install xlsx
```

**❌ "StorageService is not exported"**
```typescript
// استخدم الاستيراد الصحيح:
import { StorageService } from './StorageService'; // named import
```

**❌ "Type 'X' is not assignable to type 'Request'"**
- تأكد من أن البيانات تطابق نوع `Request` من `DataContext`
- استخدم `date` و `details` بدلاً من الحقول المخصصة

## سجل الاستيراد

جميع الاستيرادات تُسجل في `localStorage` تحت:
```javascript
const logs = JSON.parse(localStorage.getItem('port-navigator-import-logs'));
```

كل سجل يحتوي على:
- `id`: معرّف الاستيراد
- `fileName`: اسم الملف المستورد
- `totalRows`: عدد الصفوف
- `successCount`: عدد الناجح
- `failedCount`: عدد الفاشل
- `timestamp`: وقت الاستيراد
- `status`: 'success' | 'partial' | 'failed'

## الخطوات التالية (اختياري)

1. **اختبارات وحدة**: صحح دالة `ImportService.importRequests`
2. **اختبارات e2e**: اختبر السيناريو الكامل من الرفع إلى الحفظ
3. **تحكم بالصلاحيات**: حدّد من يمكنه استيراد البيانات
4. **معاينة خريطة**: أضف عرض مواقع السفن على الخريطة قبل الاستيراد
5. **رفع متعدد**: اسمح برفع عدة ملفات في نفس الوقت
