# 📦 نظام التخزين الدائم للبيانات (Data Persistence System)

## ✅ تم الإعداد بنجاح

تم تطبيق نظام تخزين متقدم يحفظ جميع بيانات التطبيق تلقائياً بدون فقدان عند:
- 🚪 تسجيل الخروج
- 🔄 إغلاق المتصفح
- 🔌 إعادة تشغيل الخادم
- 🌐 إعادة تحميل الصفحة

---

## 🏗️ البنية المعمارية

```
┌─────────────────────────────┐
│  React Component            │
│  (Requests, Complaints)     │
└────────────┬────────────────┘
             │
┌────────────▼────────────────────────┐
│  DataContext.tsx                    │
│  - يدير الـ state                   │
│  - يستدعي StorageService          │
│  - يحافظ على البيانات محدّثة      │
└────────────┬─────────────────────────┘
             │
┌────────────▼──────────────────────────────┐
│  StorageService (Singleton)                │
│  - حفظ/استرجاع الطلبات                   │
│  - حفظ/استرجاع الشكاوى                   │
│  - إدارة بيانات المستخدم الحالي         │
│  - تصدير/استيراد البيانات               │
│  - إحصائيات التخزين                      │
└────────────┬───────────────────────────────┘
             │
┌────────────▼────────────────────┐
│  Browser localStorage          │
│  - حفظ دائم (~5-10MB)           │
│  - سريع وموثوق                 │
└─────────────────────────────────┘
```

---

## 🔧 المكونات الرئيسية

### 1️⃣ useLocalStorage Hook
📍 `src/hooks/useLocalStorage.ts`

```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

// استخدام في component
const [data, setData, removeData] = useLocalStorage<MyData>('myKey', initialValue);

// حفظ البيانات
setData({ name: 'علي', age: 30 });

// حذف البيانات
removeData();

// ميزات:
// ✅ مزامنة تلقائية بين العلامات (tabs)
// ✅ معالجة أخطاء آمنة
// ✅ SSR compatible
```

### 2️⃣ useIndexedDB Hook
📍 `src/hooks/useIndexedDB.ts`

للبيانات الكبيرة والمعقدة (50MB+):

```tsx
import { useIndexedDB } from '@/hooks/useIndexedDB';

const config = {
  dbName: 'port-navigator-db',
  version: 1,
  stores: {
    requests: 'id',
    complaints: 'id',
  },
};

const { loading, error, add, update, delete: delete_, get, getAll, clear } = 
  useIndexedDB(config, 'requests');

// إضافة سجل
await add({ id: '1', title: 'طلب جديد' });

// استرجاع الكل
const allRequests = await getAll();

// حذف
await delete_('1');
```

### 3️⃣ StorageService (Singleton)
📍 `src/lib/StorageService.ts`

الخدمة الموحدة لإدارة جميع البيانات:

```tsx
import { StorageService } from '@/lib/StorageService';

// ========== الطلبات ==========
// إضافة
StorageService.addRequest(request);

// استرجاع الكل
const allRequests = StorageService.getRequests();

// استرجاع لمستخدم معين
const userRequests = StorageService.getRequests(userId);

// تحديث الحالة
StorageService.updateRequestStatus('request-id', 'approved');

// حذف
StorageService.deleteRequest('request-id');

// ========== الشكاوى ==========
StorageService.addComplaint(complaint);
StorageService.getComplaints(userId);
StorageService.updateComplaintStatus('complaint-id', 'resolved');
StorageService.deleteComplaint('complaint-id');

// ========== المستخدم الحالي ==========
StorageService.setCurrentUser(user);
const currentUser = StorageService.getCurrentUser();

// ========== المخازن ==========
StorageService.setWarehouses(warehouses);
const warehouses = StorageService.getWarehouses();
const warehouse = StorageService.searchWarehouse('الدلتا للسكر');

// ========== إدارة البيانات ==========
// تصدير (backup)
const json = StorageService.exportData();

// استيراد (restore)
StorageService.importData(json);

// إحصائيات
const stats = StorageService.getStorageStats();
// {
//   totalRequests: 5,
//   totalComplaints: 3,
//   totalWarehouses: 50,
//   storageSize: 45000, // bytes
//   lastSync: '2026-02-08T...'
// }

// حجم التخزين
const size = StorageService.getStorageSize();

// مسح الكل
StorageService.clearAll();
```

### 4️⃣ DataContext (محدّث)
📍 `src/contexts/DataContext.tsx`

الآن يستخدم StorageService تلقائياً:

```tsx
import { useData } from '@/contexts/DataContext';

const MyComponent = () => {
  const { requests, complaints, addRequest, updateRequestStatus } = useData();

  // جميع البيانات تُحفظ تلقائياً في localStorage
  const handleAddRequest = () => {
    addRequest({
      type: 'warehouse',
      title: 'طلب جديد',
      details: 'تفاصيل...',
    });
  };

  return (
    <div>
      {requests.map(req => (
        <div key={req.id}>{req.title}</div>
      ))}
    </div>
  );
};
```

---

## 💾 خريطة التخزين

```
localStorage
├── 'port-navigator-data'     ← البيانات الرئيسية
│   ├── users[]
│   ├── requests[]
│   ├── complaints[]
│   ├── warehouses[]
│   ├── currentUser
│   └── lastSync
│
├── 'port-navigator-user'     ← المستخدم الحالي (cache)
│
└── 'port-navigator-sync'    ← آخر وقت مزامنة
```

---

## 🔒 الأمان والخصوصية

```tsx
// لا تحفظ كلمات المرور (أبداً!)
const user = {
  id: '123',
  email: 'user@example.com',
  password: undefined, // ❌ لا تُحفظ هنا
  userType: 'COMMUNITY',
};

// الحفاظ على التوافق مع التحقق من الهوية
// استخدم sessionStorage للـ tokens الحساسة
sessionStorage.setItem('auth-token', token);
```

---

## 📊 مثال عملي شامل

```tsx
// src/pages/Requests.tsx
import { useData } from '@/contexts/DataContext';
import { StorageService } from '@/lib/StorageService';

export const Requests = () => {
  const { requests, addRequest, updateRequestStatus } = useData();

  const handleSubmit = (formData) => {
    // 1. إضافة الطلب
    addRequest({
      type: formData.type,
      title: formData.title,
      details: formData.details,
      userId: currentUser.id, // ربط مع المستخدم
    });

    // 2. البيانات تُحفظ تلقائياً في localStorage ✅

    // 3. عند إعادة التحميل، تُسترجع البيانات تلقائياً
  };

  const handleApprove = (requestId) => {
    updateRequestStatus(requestId, 'approved');
    // يُحفظ تلقائياً ✅
  };

  // إذا أردت الوصول المباشر للبيانات المحفوظة:
  const stats = StorageService.getStorageStats();
  console.log(`لديك ${stats.totalRequests} طلبات محفوظة`);

  return (
    <div>
      {requests.map(req => (
        <div key={req.id}>
          <h3>{req.title}</h3>
          <p>{req.details}</p>
          <button onClick={() => handleApprove(req.id)}>
            تأييد
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 🚀 استخدام متقدم

### Backup تلقائي

```tsx
// تصدير البيانات كل ساعة
useEffect(() => {
  const interval = setInterval(() => {
    const backup = StorageService.exportData();
    localStorage.setItem(`backup-${Date.now()}`, backup);
  }, 60 * 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

### استيراد من ملف

```tsx
const handleImport = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = e.target?.result as string;
      StorageService.importData(json);
      toast.success('تم استيراد البيانات بنجاح');
    } catch (error) {
      toast.error('خطأ في الملف');
    }
  };
  reader.readAsText(file);
};
```

### المزامنة مع Backend (مستقبلي)

```tsx
// عند توفر backend API
const syncWithBackend = async () => {
  const data = StorageService.getData();
  
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Sync failed, will retry later');
  }
};
```

---

## ✅ الحالة الحالية

| الميزة | الحالة |
|--------|--------|
| حفظ الطلبات | ✅ مفعّل |
| حفظ الشكاوى | ✅ مفعّل |
| حفظ المستخدم الحالي | ✅ مفعّل |
| حفظ المخازن | ✅ مفعّل |
| استرجاع تلقائي | ✅ مفعّل |
| المزامنة بين العلامات | ✅ مفعّل |
| Backup/Restore | ✅ متاح |

---

## 📈 الخطوات القادمة (اختيارية)

1. **إضافة Backend (Supabase/Firebase)**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **المزامنة الثنائية (Sync)**
   - حفظ محلي فوري
   - إرسال إلى Backend عند الاتصال

3. **Offline Mode**
   - العمل بدون internet
   - المزامنة عند العودة للاتصال

4. **تشفير البيانات**
   ```bash
   npm install crypto-js
   ```

---

## 🎯 الفوائد

✅ **بدون Backend معقد** - بيانات محفوظة محلياً  
✅ **آمن وسريع** - localStorage معياري  
✅ **لا للفقدان** - البيانات تبقى دائماً  
✅ **سهل التطوير** - hooks بسيطة وواضحة  
✅ **قابل للتوسع** - جاهز للـ backend المستقبلي  

---

## 📞 ملاحظات إضافية

- **حجم التخزين**: localStorage محدود بـ ~5-10MB (كافٍ للآلاف من السجلات)
- **الأداء**: سريع جداً (milliseconds) للقراءة والكتابة
- **التوافق**: يعمل على جميع المتصفحات الحديثة
- **الخصوصية**: البيانات تبقى على جهاز المستخدم فقط

جميع الحسابات والعمليات الآن محفوظة بشكل دائم! 🎉
