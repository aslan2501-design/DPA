// نظام الصلاحيات والأدوار
import { User, Permission } from '@/contexts/AuthContext';

export const PERMISSIONS_MAP = {
  VIEW_ALL: {
    ar: 'عرض الكل',
    en: 'View All',
  },
  VIEW_REPORTS: {
    ar: 'عرض التقارير',
    en: 'View Reports',
  },
  VIEW_REQUESTS: {
    ar: 'عرض الطلبات',
    en: 'View Requests',
  },
  VIEW_COMPLAINTS: {
    ar: 'عرض الشكاوى',
    en: 'View Complaints',
  },
  EDIT_SHIPPING: {
    ar: 'تحديث بيانات الشحن',
    en: 'Edit Shipping Data',
  },
  UPLOAD_DOCUMENTS: {
    ar: 'رفع المستندات',
    en: 'Upload Documents',
  },
  VIEW_HYDROGRAPHY: {
    ar: 'عرض المعلومات الملاحية',
    en: 'View Hydrography',
  },
  EDIT_DATA: {
    ar: 'تحرير البيانات',
    en: 'Edit Data',
  },
  ADMIN_ACCESS: {
    ar: 'صلاحيات الإدارة',
    en: 'Admin Access',
  },
};

export const ROLES_MAP = {
  CHAIRMAN: {
    ar: 'رئيس مجلس الإدارة',
    en: 'Board Chairman',
    description: {
      ar: 'صلاحيات مشاهدة كاملة لكل التقارير والطلبات والشكاوى ومعدلات النحر والاطماء',
      en: 'Full view permissions for all reports, requests, complaints and erosion data',
    },
  },
  ADMIN: {
    ar: 'مدير النظام',
    en: 'System Administrator',
    description: {
      ar: 'صلاحيات كاملة لإدارة النظام',
      en: 'Full system administration permissions',
    },
  },
  DPA_STAFF: {
    ar: 'موظف الهيئة',
    en: 'DPA Staff',
    description: {
      ar: 'موظفي هيئة ميناء دمياط',
      en: 'Port Authority Staff',
    },
  },
  COMMUNITY: {
    ar: 'جهات خارجية',
    en: 'External Parties',
    description: {
      ar: 'شركات وتوكيلات ملاحية',
      en: 'shipping companies and maritime agencies',
    },
  },
};

// دالة للتحقق من وجود صلاحية معينة
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  return user.permissions?.includes(permission) ?? false;
};

// دالة للتحقق من وجود أي صلاحية من قائمة
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.some((p) => user.permissions?.includes(p));
};

// دالة للتحقق من وجود كل الصلاحيات من قائمة
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.every((p) => user.permissions?.includes(p));
};

// دالة للتحقق من نوع المستخدم
export const isUserType = (user: User | null, userType: string): boolean => {
  if (!user) return false;
  return user.userType === userType;
};

// دالة للتحقق من وصول المسؤول
export const isAdmin = (user: User | null): boolean => {
  return isUserType(user, 'ADMIN') || isUserType(user, 'CHAIRMAN');
};

// دالة للحصول على وصف الصلاحيات
export const getPermissionDescription = (permission: Permission, language: 'ar' | 'en' = 'ar'): string => {
  return PERMISSIONS_MAP[permission]?.[language] || permission;
};

// دالة للحصول على وصف الدور
export const getRoleDescription = (role: string, language: 'ar' | 'en' = 'ar'): string => {
  return (ROLES_MAP[role as keyof typeof ROLES_MAP]?.description?.[language] ||
    ROLES_MAP[role as keyof typeof ROLES_MAP]?.[language] ||
    role);
};
