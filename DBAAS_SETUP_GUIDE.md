# دليل إعداد DBaaS (Database-as-a-Service) للموقع

## 📊 الحالة الحالية للمشروع
- **التخزين الحالي:** IndexedDB (محلي على جهاز المستخدم)
- **البيانات المتوفرة:** 
  - Requests (طلبات المخازن والعربات)
  - Complaints (الشكاوى والبلاغات)
- **البيئة:** React + Vite، Frontend على Vercel
- **المشكلة:** البيانات مفقودة عند مسح الـ Cache أو تغيير الجهاز

---

## 🎯 الخطوة 1: اختيار DBaaS المناسب

### الخيار الأول: **Supabase (اختيارنا الموصى به) ⭐**
**المميزات:**
- PostgreSQL علائقي (مناسب لـ Requests و Complaints)
- أداء عالي جداً مع بيانات منظمة
- تأمين built-in مع Row Level Security (RLS)
- عرض بيانات فوري وسهل
- مناسب للتطبيقات المؤسسية

**السعر:** مجاني للـ Development (مع حدود)، $25+/شهر للـ Production

**مثالن الاتصال:**
```
postgresql://user:password@api.supabase.co:5432/postgres
```

### الخيار الثاني: MongoDB Atlas
**المميزات:**
- NoSQL مرن (إذا كنت تريد إضافة حقول دون تغيير الجداول)
- سهل للـ Prototyping السريع
- قاعدة البيانات تحتمل تغيرات في الهيكل

**السعر:** مجاني (Shared)، $57+/شهر (Dedicated)

**مثال الاتصال:**
```
mongodb+srv://user:password@cluster.mongodb.net/port_db
```

### 🏆 التوصية النهائية:
**استخدم Supabase** لأن:
1. بيانات الموانئ والمخازن منظمة جداً (جداول واضحة)
2. أداء ممتاز مع Queries معقدة
3. أسهل في الصيانة على المدى الطويل
4. تأمين قوي مع RLS

---

## 🚀 الخطوة 2: إنشاء حساب Supabase وقاعدة البيانات

### 2.1 إنشاء حساب (5 دقائق)
1. اذهب لـ https://app.supabase.com
2. سجل دخول باستخدام GitHub
3. انقر على "New Project"
4. ملأ البيانات:
   - **Project Name:** `port-damietta` أو أي اسم يعجبك
   - **Database Password:** احفظ الباسورد في مكان آمن!
   - **Region:** اختر `eu-west` أو `me-central` (الأقرب جغرافياً)
5. انتظر 2-3 دقائق حتى ينتج المشروع

### 2.2 الحصول على Connection String
بعد الإنشاء:
1. اذهب إلى "Project Settings" → "Database"
2. انسخ **Connection String** (اختر نسخة `psycopg2` أو `nodejs`)
3. الرابط سيبدو هكذا:
```
postgresql://postgres.xxxxx:AhndlsdfyPa@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

---

## 📋 الخطوة 3: إنشاء الجداول (Tables)

### جدول Requests
```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('warehouse', 'trolley')),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress')),
  details TEXT NOT NULL,
  vessel_name VARCHAR(255),
  shipping_agent VARCHAR(255),
  cargo_type VARCHAR(255),
  quantity VARCHAR(255),
  from_date TIMESTAMP,
  to_date TIMESTAMP,
  owner VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);
```

### جدول Complaints
```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  created_by VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  fault_type VARCHAR(255) NOT NULL,
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  location VARCHAR(255) NOT NULL,
  facility_id UUID,
  map_path TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
```

### جدول Users (اختياري - لتوثيق البيانات)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'staff', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**كيفية التنفيذ:**
1. في Supabase، اذهب إلى "SQL Editor"
2. انسخ الأكواد أعلاه والصقها
3. اضغط "Run" لكل جزء

---

## 🔐 الخطوة 4: حماية البيانات بـ Environment Variables

### 4.1 إنشاء ملف `.env.local`
في جذر المشروع، أنشئ ملف باسم `.env.local` (لا ترفعه على GitHub):

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_DATABASE_URL=postgresql://postgres...
```

### 4.2 إضافته إلى `.gitignore`
تأكد من وجود هذا السطر في `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 4.3 رفع على Vercel
ملء البيانات على سيرفر الـ Production:
1. اذهب إلى https://vercel.com/dashboard
2. اختر المشروع
3. انقر على "Settings" → "Environment Variables"
4. أضف نفس المتغيرات من الأعلى

---

## 💻 الخطوة 5: تعديل الكود (تثبيت والاتصال)

### 5.1 تثبيت مكتبة Supabase
```bash
npm install @supabase/supabase-js
```

### 5.2 إنشاء ملف `supabaseClient.ts`
في `src/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 5.3 تعديل DataContext للاتصال بـ Supabase
في `src/contexts/DataContext.tsx`:

```typescript
import { supabase } from '@/lib/supabaseClient';

// في useEffect الأولي، بدل من AdvancedStorageService:
useEffect(() => {
  const loadData = async () => {
    try {
      // تحميل Requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      setRequests(requestsData || []);

      // تحميل Complaints
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (complaintsError) throw complaintsError;
      setComplaints(complaintsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  loadData();
}, []);

// تعديل addRequest
const addRequest = async (request: Omit<Request, 'id' | 'date'>, status?: Request['status']) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          ...request,
          status: status || 'pending',
          user_id: 'temp_user_id', // سيصبح null أو تحصل عليه من Auth
        }
      ])
      .select();

    if (error) throw error;
    setRequests([...requests, data[0]]);
  } catch (error) {
    console.error('Error adding request:', error);
  }
};

// تعديل addComplaint (نفس الفكرة)
const addComplaint = async (complaint: Omit<Complaint, 'id' | 'date' | 'userId'>, userId?: string) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert([
        {
          ...complaint,
          user_id: userId,
        }
      ])
      .select();

    if (error) throw error;
    setComplaints([...complaints, data[0]]);
  } catch (error) {
    console.error('Error adding complaint:', error);
  }
};
```

---

## 🔑 الخطوة 6: إضافة التوثيق (Authentication)

### 6.1 تفعيل التوثيق في Supabase
1. اذهب إلى "Authentication" → "Providers"
2. فعّل "Email" و "Google"

### 6.2 تحديث AuthContext
في `src/contexts/AuthContext.tsx`:

```typescript
import { supabase } from '@/lib/supabaseClient';

// Login
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  setUser(data.user);
  setIsAuthenticated(true);
};

// Register
const register = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  // أضف بيانات بإضافية في جدول users
  await supabase.from('users').insert([{ id: data.user?.id, email, name }]);
};

// Logout
const logout = async () => {
  await supabase.auth.signOut();
  setUser(null);
  setIsAuthenticated(false);
};
```

---

## 🧪 الخطوة 7: الاختبار

### 7.1 اختبار محلي
```bash
npm run dev
```

### 7.2 اختبار على Vercel
```bash
vercel env pull  # سحب متغيرات البيئة من Vercel
npm run build
vercel
```

---

## 📊 الخطوة 8: Monitoring والصيانة

### مراقبة الأداء
1. في Supabase، اذهب إلى "Database" → "Logs"
2. راجع الـ Slow Queries وأضف Indexes

### النسخ الاحتياطي
Supabase يعمل نسخ احتياطية تلقائية كل يوم (بالمجان)

### تنظيف البيانات
```bash
# حذف records قديمة (مثال)
DELETE FROM complaints WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## ⚠️ نصائح أمان مهمة

| ❌ خطأ | ✅ الصح |
|--------|--------|
| نسخ Connection String مباشرة في الكود | استخدم `.env.local` و Environment Variables |
| رفع `.env` على GitHub | أضفه في `.gitignore` |
| استخدام نفس الباسورد في كل مكان | استخدم Supabase Auth & RLS |
| الوثوق بـ Frontend فقط للتحقق | أضف Validation في Backend (Supabase Functions) |

---

## 🎓 الخطوات التالية

بعد هذا التثبيت، يمكنك:
1. **إضافة Supabase Realtime:** للتحديثات المباشرة
2. **إعداد Webhooks:** لتشغيل وظائف تلقائياً عند إدراج بيانات
3. **تطبيق RLS:** للتحكم في من يرى ماذا
4. **إضافة Supabase Functions:** لـ Backend Logic معقد

---

## 📞 الدعم والمراجع

- **Supabase الرسمية:** https://supabase.com/docs
- **React + Supabase:** https://supabase.com/docs/guides/getting-started/quickstarts/react
- **أمان:** https://supabase.com/docs/guides/auth/row-level-security

---

**آخر تحديث:** فبراير 2026
**حالة المشروع:** جاهز للانتقال من IndexedDB إلى Supabase ✅
