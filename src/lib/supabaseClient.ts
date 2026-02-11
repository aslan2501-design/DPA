import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client
 * 
 * يتم استخدام هذا الملف للاتصال بقاعدة البيانات السحابية
 * تأكد من إضافة متغيرات البيئة في:
 * - .env.local (للـ Development)
 * - Vercel Settings (للـ Production)
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// التحقق من وجود البيانات المطلوبة
if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL');
  throw new Error('VITE_SUPABASE_URL is not defined. Add it to .env.local');
}

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_KEY');
  throw new Error('VITE_SUPABASE_KEY is not defined. Add it to .env.local');
}

// إنشاء Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  }
});

console.log('✅ Supabase client initialized successfully');
