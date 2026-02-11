/**
 * StorageService: خدمة موحدة لإدارة تخزين جميع بيانات التطبيق
 * تستخدم localStorage للبيانات الصغيرة و IndexedDB للبيانات الكبيرة
 */

import { Request, Complaint } from '@/contexts/DataContext';

export interface StoredUser {
  id: string;
  email: string;
  password?: string;
  userType: string;
  classification?: string;
  loginTime?: string;
  lastActive?: string;
}

export interface StoredWarehouse {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity?: number;
  available?: number;
}

interface StorageData {
  users: StoredUser[];
  requests: Request[];
  complaints: Complaint[];
  warehouses: StoredWarehouse[];
  currentUser: StoredUser | null;
  lastSync: string;
}

class StorageServiceClass {
  private static readonly STORAGE_KEY = 'port-navigator-data';
  private static readonly USER_KEY = 'port-navigator-user';
  private static readonly SYNC_KEY = 'port-navigator-sync';
  private static readonly STORAGE_VERSION = '1.0';

  /**
   * حفظ البيانات كاملة (localStorage)
   */
  saveData(data: Partial<StorageData>) {
    try {
      const existing = this.getData();
      const merged = { ...existing, ...data };
      merged.lastSync = new Date().toISOString();
      
      localStorage.setItem(
        StorageServiceClass.STORAGE_KEY,
        JSON.stringify(merged)
      );
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  /**
   * استرجاع جميع البيانات
   */
  getData(): StorageData {
    try {
      const data = localStorage.getItem(StorageServiceClass.STORAGE_KEY);
      return data
        ? JSON.parse(data)
        : {
            users: [],
            requests: [],
            complaints: [],
            warehouses: [],
            currentUser: null,
            lastSync: new Date().toISOString(),
          };
    } catch (error) {
      console.error('Error reading data from localStorage:', error);
      return {
        users: [],
        requests: [],
        complaints: [],
        warehouses: [],
        currentUser: null,
        lastSync: new Date().toISOString(),
      };
    }
  }

  /**
   * حفظ المستخدم الحالي
   */
  setCurrentUser(user: StoredUser | null) {
    try {
      if (user) {
        localStorage.setItem(StorageServiceClass.USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(StorageServiceClass.USER_KEY);
      }
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  /**
   * استرجاع المستخدم الحالي
   */
  getCurrentUser(): StoredUser | null {
    try {
      const user = localStorage.getItem(StorageServiceClass.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading current user:', error);
      return null;
    }
  }

  /**
   * إضافة طلب جديد
   */
  addRequest(request: Request) {
    const data = this.getData();
    data.requests = [request, ...data.requests];
    this.saveData(data);
  }

  /**
   * تحديث حالة الطلب
   */
  updateRequestStatus(id: string, status: Request['status']) {
    const data = this.getData();
    data.requests = data.requests.map((req) =>
      req.id === id ? { ...req, status } : req
    );
    this.saveData(data);
  }

  /**
   * حذف طلب
   */
  deleteRequest(id: string) {
    const data = this.getData();
    data.requests = data.requests.filter((req) => req.id !== id);
    this.saveData(data);
  }

  /**
   * استرجاع الطلبات (مع فلترة اختيارية)
   */
  getRequests(userId?: string): Request[] {
    const data = this.getData();
    if (userId) {
      return data.requests.filter((req) => req.userId === userId);
    }
    return data.requests;
  }

  /**
   * إضافة شكوى جديدة
   */
  addComplaint(complaint: Complaint) {
    const data = this.getData();
    data.complaints = [complaint, ...data.complaints];
    this.saveData(data);
  }

  /**
   * تحديث حالة الشكوى
   */
  updateComplaintStatus(id: string, status: Complaint['status']) {
    const data = this.getData();
    data.complaints = data.complaints.map((comp) =>
      comp.id === id ? { ...comp, status } : comp
    );
    this.saveData(data);
  }

  /**
   * حذف شكوى
   */
  deleteComplaint(id: string) {
    const data = this.getData();
    data.complaints = data.complaints.filter((comp) => comp.id !== id);
    this.saveData(data);
  }

  /**
   * استرجاع الشكاوى (مع فلترة اختيارية)
   */
  getComplaints(userId?: string): Complaint[] {
    const data = this.getData();
    if (userId) {
      return data.complaints.filter(
        (comp) => comp.userId === userId || comp.createdBy === userId
      );
    }
    return data.complaints;
  }

  /**
   * حفظ المخازن
   */
  setWarehouses(warehouses: StoredWarehouse[]) {
    const data = this.getData();
    data.warehouses = warehouses;
    this.saveData(data);
  }

  /**
   * استرجاع المخازن
   */
  getWarehouses(): StoredWarehouse[] {
    return this.getData().warehouses;
  }

  /**
   * البحث عن مخزن بالاسم
   */
  searchWarehouse(name: string): StoredWarehouse | undefined {
    return this.getData().warehouses.find((w) =>
      w.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * الحصول على آخر وقت sync
   */
  getLastSync(): Date {
    const data = this.getData();
    return new Date(data.lastSync);
  }

  /**
   * مسح جميع البيانات
   */
  clearAll() {
    localStorage.removeItem(StorageServiceClass.STORAGE_KEY);
    localStorage.removeItem(StorageServiceClass.USER_KEY);
  }

  /**
   * تصدير البيانات كـ JSON (للـ backup)
   */
  exportData(): string {
    return JSON.stringify(this.getData(), null, 2);
  }

  /**
   * استيراد البيانات من JSON
   */
  importData(jsonString: string) {
    try {
      const data = JSON.parse(jsonString);
      this.saveData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid JSON format');
    }
  }

  /**
   * حساب حجم البيانات المخزنة
   */
  getStorageSize(): number {
    const data = JSON.stringify(this.getData());
    return new Blob([data]).size;
  }

  /**
   * الحصول على إحصائيات التخزين
   */
  getStorageStats() {
    const data = this.getData();
    return {
      totalRequests: data.requests.length,
      totalComplaints: data.complaints.length,
      totalWarehouses: data.warehouses.length,
      totalUsers: data.users.length,
      storageSize: this.getStorageSize(),
      lastSync: data.lastSync,
    };
  }
}

// Singleton instance
export const StorageService = new StorageServiceClass();
