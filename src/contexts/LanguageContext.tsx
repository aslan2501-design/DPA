import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.requests': 'الطلبات',
    'nav.warehouse': 'طلبات المخازن',
    'nav.trolley': 'طلبات تراكى السفن',
    'nav.complaints': 'بلاغات الصيانة',
    'nav.map': 'التجوال الافتراضي',
    'nav.admin': 'الإدارة',

    'nav.settings': 'الإعدادات',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    'nav.profile': 'الملف الشخصي',

    // Landing Page
    'landing.title': 'منصة ميناء دمياط الذكية',
    'landing.subtitle': 'نظام إدارة جغرافي متكامل للخدمات والعمليات',
    'landing.cta': 'ابدأ الآن',
    'landing.features': 'المميزات',
    'landing.feature1.title': 'إدارة ذكية',
    'landing.feature1.desc': 'نظام متكامل لإدارة جميع عمليات الميناء',
    'landing.feature2.title': 'خرائط تفاعلية',
    'landing.feature2.desc': 'تتبع مباشر للمرافق والأصول على الخريطة',
    'landing.feature3.title': 'أمان متقدم',
    'landing.feature3.desc': 'نظام أكواد أمنية متعدد المستويات',
    'landing.feature4.title': 'تقارير فورية',
    'landing.feature4.desc': 'لوحات تحكم تفاعلية وتحليلات متقدمة',

    // Auth
    'auth.login.title': 'تسجيل الدخول',
    'auth.login.email': 'البريد الإلكتروني',
    'auth.login.password': 'كلمة المرور',
    'auth.login.submit': 'دخول',
    'auth.login.noAccount': 'ليس لديك حساب؟',
    'auth.register.title': 'إنشاء حساب جديد',
    'auth.register.name': 'الاسم الكامل',
    'auth.register.phone': 'رقم الهاتف',
    'auth.register.securityCode': 'الكود الأمني',
    'auth.register.userType': 'نوع المستخدم',
    'auth.register.staff': 'موظف الهيئة',
    'auth.register.community': 'متعامل خارجي',
    'auth.register.submit': 'إنشاء الحساب',
    'auth.register.hasAccount': 'لديك حساب بالفعل؟',

    // Dashboard
    'dashboard.welcome': 'مرحباً',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.totalRequests': 'إجمالي الطلبات',
    'dashboard.pending': 'قيد الانتظار',
    'dashboard.approved': 'مقبولة',
    'dashboard.rejected': 'مرفوضة',
    'dashboard.recentActivity': 'النشاط الأخير',

    // Requests
    'requests.warehouse.title': 'تأجير مخزن',
    'requests.warehouse.selectOnMap': 'اختيار المخزن على الخريطة',
    'requests.warehouse.owner': 'صاحب الشأن',
    'requests.warehouse.cargoType': 'نوع بضاعة المخزن',
    'requests.warehouse.quantity': 'الكمية',
    'requests.warehouse.fromDate': 'من تاريخ',
    'requests.warehouse.toDate': 'إلى تاريخ (نتيجة)',
    'requests.trolley.title': 'طلب تراكى سفينة',
    'requests.trolley.vesselName': 'اسم السفينة',
    'requests.trolley.attachments': 'إرفاق بيانات / مستندات',
    'requests.trolley.shippingAgent': 'التوكيل الملاحي',
    'requests.submit': 'إرسال الطلب',
    'requests.status': 'حالة الطلب',

    // Complaints
    'complaints.title': 'شكوى صيانة جديدة',
    'complaints.faultType': 'نوع العطل',
    'complaints.priority': 'الأولوية',
    'complaints.description': 'وصف المشكلة',
    'complaints.location': 'تحديد الموقع على الخريطة',
    'complaints.submit': 'إرسال الشكوى',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.high': 'عالية',
    'common.medium': 'متوسطة',
    'common.low': 'منخفضة',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.requests': 'Requests',
    'nav.warehouse': 'Warehouse Requests',
    'nav.trolley': 'Berthing Requests',
    'nav.complaints': 'Maintenance & Complaints',
    'nav.map': 'Interactive Map',
    'nav.admin': 'Administration',

    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',

    // Landing Page
    'landing.title': 'Smart Damietta Port Platform',
    'landing.subtitle': 'Integrated Spatial Management System for Services & Operations',
    'landing.cta': 'Get Started',
    'landing.features': 'Features',
    'landing.feature1.title': 'Smart Management',
    'landing.feature1.desc': 'Integrated system for all port operations',
    'landing.feature2.title': 'Interactive Maps',
    'landing.feature2.desc': 'Real-time tracking of facilities and assets',
    'landing.feature3.title': 'Advanced Security',
    'landing.feature3.desc': 'Multi-level security code system',
    'landing.feature4.title': 'Instant Reports',
    'landing.feature4.desc': 'Interactive dashboards and advanced analytics',

    // Auth
    'auth.login.title': 'Login',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.submit': 'Sign In',
    'auth.login.noAccount': "Don't have an account?",
    'auth.register.title': 'Create New Account',
    'auth.register.name': 'Full Name',
    'auth.register.phone': 'Phone Number',
    'auth.register.securityCode': 'Security Code',
    'auth.register.userType': 'User Type',
    'auth.register.staff': 'DPA Staff',
    'auth.register.community': 'External User',
    'auth.register.submit': 'Create Account',
    'auth.register.hasAccount': 'Already have an account?',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.totalRequests': 'Total Requests',
    'dashboard.pending': 'Pending',
    'dashboard.approved': 'Approved',
    'dashboard.rejected': 'Rejected',
    'dashboard.recentActivity': 'Recent Activity',

    // Requests
    'requests.warehouse.title': 'Warehouse Rental',
    'requests.warehouse.selectOnMap': 'Select Warehouse on Map',
    'requests.warehouse.owner': 'Interested Party / Owner',
    'requests.warehouse.cargoType': 'Warehouse Cargo Type',
    'requests.warehouse.quantity': 'Quantity',
    'requests.warehouse.fromDate': 'From Date',
    'requests.warehouse.toDate': 'To Date',
    'requests.trolley.title': 'Vessel Berthing Request',
    'requests.trolley.vesselName': 'Vessel Name',
    'requests.trolley.attachments': 'Attach Data / Documents',
    'requests.trolley.shippingAgent': 'Shipping Agency',
    'requests.submit': 'Submit Request',
    'requests.status': 'Request Status',

    // Complaints
    'complaints.title': 'New Maintenance Complaint',
    'complaints.faultType': 'Fault Type',
    'complaints.priority': 'Priority',
    'complaints.description': 'Problem Description',
    'complaints.location': 'Mark Location on Map',
    'complaints.submit': 'Submit Complaint',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.high': 'High',
    'common.medium': 'Medium',
    'common.low': 'Low',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
