/**
 * Supabase Operations
 * 
 * أمثلة عملية لـ CRUD Operations على قاعدة البيانات
 * استخدمها كمرجع لتحديث DataContext و AuthContext
 */

import { supabase } from './supabaseClient';
import type { Request, Complaint } from '@/contexts/DataContext';

// ========================
// 📝 REQUESTS Operations
// ========================

export const requestOperations = {
  /**
   * الحصول على جميع الطلبات
   */
  async getAll() {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch requests: ${error.message}`);
    return data || [];
  },

  /**
   * الحصول على طلبات مستخدم معين
   */
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user requests: ${error.message}`);
    return data || [];
  },

  /**
   * البحث عن طلب بـ ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Failed to fetch request: ${error.message}`);
    return data;
  },

  /**
   * إنشاء طلب جديد
   */
  async create(request: Omit<Request, 'id' | 'date'>, userId: string) {
    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          ...request,
          user_id: userId,
        }
      ])
      .select()
      .single();

    if (error) throw new Error(`Failed to create request: ${error.message}`);
    return data;
  },

  /**
   * تحديث حالة الطلب
   */
  async updateStatus(id: string, status: Request['status']) {
    const { data, error } = await supabase
      .from('requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update request: ${error.message}`);
    return data;
  },

  /**
   * حذف طلب
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete request: ${error.message}`);
  },

  /**
   * البحث عن طلبات بحالة معينة
   */
  async getByStatus(status: Request['status']) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch requests by status: ${error.message}`);
    return data || [];
  }
};

// ========================
// 🚨 COMPLAINTS Operations
// ========================

export const complaintOperations = {
  /**
   * الحصول على جميع الشكاوى
   */
  async getAll() {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch complaints: ${error.message}`);
    return data || [];
  },

  /**
   * الحصول على شكاوى مستخدم معين
   */
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user complaints: ${error.message}`);
    return data || [];
  },

  /**
   * البحث عن شكوى بـ ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Failed to fetch complaint: ${error.message}`);
    return data;
  },

  /**
   * إنشاء شكوى جديدة
   */
  async create(complaint: Omit<Complaint, 'id' | 'date'>, userId?: string) {
    const { data, error } = await supabase
      .from('complaints')
      .insert([
        {
          ...complaint,
          user_id: userId,
        }
      ])
      .select()
      .single();

    if (error) throw new Error(`Failed to create complaint: ${error.message}`);
    return data;
  },

  /**
   * تحديث حالة الشكوى
   */
  async updateStatus(id: string, status: Complaint['status']) {
    const { data, error } = await supabase
      .from('complaints')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update complaint: ${error.message}`);
    return data;
  },

  /**
   * حذف شكوى
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete complaint: ${error.message}`);
  },

  /**
   * الحصول على شكاوى بأولوية معينة
   */
  async getByPriority(priority: Complaint['priority']) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('priority', priority)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch complaints by priority: ${error.message}`);
    return data || [];
  },

  /**
   * الحصول على شكاوى بحالة معينة
   */
  async getByStatus(status: Complaint['status']) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch complaints by status: ${error.message}`);
    return data || [];
  },

  /**
   * البحث عن شكاوى بموقع معين
   */
  async getByLocation(location: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .ilike('location', `%${location}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch complaints by location: ${error.message}`);
    return data || [];
  }
};

// ========================
// 👤 USERS Operations
// ========================

export const userOperations = {
  /**
   * الحصول على البيانات الكاملة للمستخدم
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(`Failed to fetch user profile: ${error.message}`);
    return data;
  },

  /**
   * تحديث بيانات المستخدم
   */
  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update profile: ${error.message}`);
    return data;
  },

  /**
   * الحصول على جميع المعاملين (Staff)
   */
  async getAllStaff() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'staff')
      .order('name');

    if (error) throw new Error(`Failed to fetch staff: ${error.message}`);
    return data || [];
  }
};

// ========================
// 🔄 REALTIME Listeners
// ========================

/**
 * الاستماع لتحديثات الطلبات في الوقت الفعلي
 */
export function subscribeToRequests(callback: (newData: Request) => void) {
  return supabase
    .channel('requests_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'requests' },
      (payload) => {
        callback(payload.new as Request);
      }
    )
    .subscribe();
}

/**
 * الاستماع لتحديثات الشكاوى في الوقت الفعلي
 */
export function subscribeToComplaints(callback: (newData: Complaint) => void) {
  return supabase
    .channel('complaints_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'complaints' },
      (payload) => {
        callback(payload.new as Complaint);
      }
    )
    .subscribe();
}

// ========================
// 🔍 Advanced Queries
// ========================

/**
 * البحث المتقدم عن الطلبات
 */
export async function searchRequests(filters: {
  userId?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  let query = supabase.from('requests').select('*');

  if (filters.userId) query = query.eq('user_id', filters.userId);
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
  if (filters.dateTo) query = query.lte('created_at', filters.dateTo);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw new Error(`Search failed: ${error.message}`);
  return data || [];
}

/**
 * البحث المتقدم عن الشكاوى
 */
export async function searchComplaints(filters: {
  userId?: string;
  status?: string;
  priority?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  let query = supabase.from('complaints').select('*');

  if (filters.userId) query = query.eq('user_id', filters.userId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.priority) query = query.eq('priority', filters.priority);
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
  if (filters.dateTo) query = query.lte('created_at', filters.dateTo);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw new Error(`Search failed: ${error.message}`);
  return data || [];
}

/**
 * الحصول على إحصائيات عامة
 */
export async function getStatistics() {
  try {
    // عدد الطلبات
    const { count: requestsCount } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true });

    // عدد الشكاوى
    const { count: complaintsCount } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });

    // الطلبات المعلقة
    const { count: pendingRequests } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // الشكاوى غير المحلولة
    const { count: openComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'resolved');

    return {
      totalRequests: requestsCount || 0,
      totalComplaints: complaintsCount || 0,
      pendingRequests: pendingRequests || 0,
      openComplaints: openComplaints || 0,
    };
  } catch (error) {
    console.error('Failed to get statistics:', error);
    return {
      totalRequests: 0,
      totalComplaints: 0,
      pendingRequests: 0,
      openComplaints: 0,
    };
  }
}
