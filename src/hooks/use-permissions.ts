import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, isUserType } from '@/lib/permissions';
import type { Permission } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  return {
    // التحقق من صلاحية واحدة
    has: (permission: Permission) => hasPermission(user, permission),
    
    // التحقق من أي صلاحية من قائمة
    hasAny: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    
    // التحقق من كل الصلاحيات من قائمة
    hasAll: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    
    // التحقق من نوع المستخدم
    isType: (userType: string) => isUserType(user, userType),
    
    // التحقق من كون المستخدم مسؤول
    isAdmin: () => isAdmin(user),
    
    // الحصول على الصلاحيات الحالية
    current: user?.permissions || [],
    
    // التحقق من أن المستخدم مصرح بـ view-only
    isReadOnly: () => user?.isReadOnly ?? false,
  };
};
