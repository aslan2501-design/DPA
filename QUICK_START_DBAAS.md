# 🚀 DBaaS Quick Start - البدء السريع

> ملف سريع لـ copy & paste جاهز للاستخدام الفوري

## خطوة 1: .env.local (العرض: 1 دقيقة ⏱️)

في جذر المشروع، أنشئ `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> لا تنسى: **لا ترفعها على GitHub!**

---

## خطوة 2: تثبيت المكتبة (2 دقيقة ⏱️)

```bash
npm install @supabase/supabase-js
```

---

## خطوة 3: نسخ الملفات المساعدة (1 دقيقة ⏱️)

تأكد من وجود هذه الملفات:
- ✅ `src/lib/supabaseClient.ts`
- ✅ `src/lib/supabaseOperations.ts`

---

## خطوة 4: تعديل DataContext (البداية السريعة)

### الخيار الأسهل: استبدال ببساطة 🎯

افتح `src/contexts/DataContext.tsx` وابدل هذا الكود:

```typescript
// ❌ هذا قديم - احذفه
import { AdvancedStorageService } from '@/lib/AdvancedStorageService';

// ✅ ضيف هذا بدلاً منه
import { requestOperations, complaintOperations } from '@/lib/supabaseOperations';
```

الآن، بدّل في `useEffect`:

```typescript
// ❌ قديم
useEffect(() => {
  const loadData = async () => {
    try {
      await AdvancedStorageService.initialize();
      const savedRequests = await AdvancedStorageService.getRequests();
      setRequests(savedRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };
  loadData();
}, []);

// ✅ جديد (Supabase)
useEffect(() => {
  const loadData = async () => {
    try {
      const savedRequests = await requestOperations.getAll();
      setRequests(savedRequests);

      const savedComplaints = await complaintOperations.getAll();
      setComplaints(savedComplaints);
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    }
  };
  loadData();
}, []);
```

---

## خطوة 5: تعديل دوال الإضافة والتحديث

### إضافة طلب جديد
```typescript
// ❌ قديم
const addRequest = async (request: Omit<Request, 'id' | 'date'>, status?: Request['status']) => {
  try {
    const newRequest = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...request,
      status: status || 'pending'
    };
    setRequests([...requests, newRequest]);
  } catch (error) {
    console.error('Error adding request:', error);
  }
};

// ✅ جديد (Supabase)
const addRequest = async (request: Omit<Request, 'id' | 'date'>, status?: Request['status']) => {
  try {
    const newRequest = await requestOperations.create(request, 'user_id_here');
    setRequests([...requests, newRequest]);
  } catch (error) {
    console.error('Error adding request:', error);
  }
};
```

### تحديث حالة الطلب
```typescript
// ❌ قديم
const updateRequestStatus = (id: string, status: Request['status']) => {
  setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
};

// ✅ جديد (Supabase)
const updateRequestStatus = async (id: string, status: Request['status']) => {
  try {
    const updated = await requestOperations.updateStatus(id, status);
    setRequests(requests.map(r => r.id === id ? updated : r));
  } catch (error) {
    console.error('Error updating request:', error);
  }
};
```

### نفس الفكرة للـ Complaints
```typescript
// ✅ إضافة complaint
const addComplaint = async (complaint: Omit<Complaint, 'id' | 'date' | 'userId'>, userId?: string) => {
  try {
    const newComplaint = await complaintOperations.create(complaint, userId);
    setComplaints([...complaints, newComplaint]);
  } catch (error) {
    console.error('Error adding complaint:', error);
  }
};

// ✅ تحديث complaint
const updateComplaintStatus = async (id: string, status: Complaint['status']) => {
  try {
    const updated = await complaintOperations.updateStatus(id, status);
    setComplaints(complaints.map(c => c.id === id ? updated : c));
  } catch (error) {
    console.error('Error updating complaint:', error);
  }
};
```

---

## خطوة 6: الاختبار المحلي (5 دقائق ⏱️)

```bash
npm run dev
```

افتح Console (F12) وتحقق:
- ✅ رسالة خضراء: `✅ Supabase client initialized successfully`
- ✅ البيانات تُحمّل من Supabase

---

## ✨ أمثلة استخدام متقدمة (اختياري)

### تصفية الطلبات بـ Status
```typescript
// في أي component
import { requestOperations } from '@/lib/supabaseOperations';

const pendingRequests = await requestOperations.getByStatus('pending');
```

### البحث المتقدم
```typescript
import { searchComplaints } from '@/lib/supabaseOperations';

const results = await searchComplaints({
  status: 'open',
  priority: 'high',
  location: 'ميناء',
  dateFrom: '2026-02-01'
});
```

### الاستماع للتحديثات الفورية (Realtime)
```typescript
import { subscribeToComplaints } from '@/lib/supabaseOperations';

useEffect(() => {
  const sub = subscribeToComplaints((newComplaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
  });

  return () => sub.unsubscribe();
}, []);
```

---

## 🆘 أخطاء شائعة عند البدء

| الخطأ | الحل |
|------|------|
| `Cannot find module '@supabase/supabase-js'` | اشغل: `npm install @supabase/supabase-js` وأعد تشغيل `npm run dev` |
| `VITE_SUPABASE_URL is not defined` | تأكد من `.env.local` يحتوي على URL و KEY |
| `Failed to fetch requests` | جرّب في Dashboard Supabase SQL Editor: `SELECT * FROM requests;` |
| TypeScript Errors | تأكد من أن `Request` و `Complaint` موجودة في DataContext |

---

## ⏱️ الوقت الإجمالي

- ✅ إعداد .env: **1 دقيقة**
- ✅ تثبيت المكتبة: **2 دقائق**
- ✅ نسخ الملفات: **1 دقيقة**
- ✅ تعديل DataContext: **10 دقائق** (copy & paste)
- ✅ الاختبار: **5 دقائق**

**المجموع: ~20 دقيقة للبدء الأول! 🎉**

---

## 📚 الخطوة التالية

بعد أن تعمل الأساسيات:
1. اقرأ [DBAAS_SETUP_GUIDE.md](DBAAS_SETUP_GUIDE.md) للتفاصيل الكاملة
2. تابع [DBAAS_MIGRATION_CHECKLIST.md](DBAAS_MIGRATION_CHECKLIST.md) خطوة بخطوة
3. استخدم [src/lib/supabaseOperations.ts](src/lib/supabaseOperations.ts) كمرجع

---

**آخر تحديث:** فبراير 2026 ✅
