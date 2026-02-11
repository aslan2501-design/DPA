/**
 * AdvancedStorageService: نظام تخزين هجين متقدم
 * localStorage (100 MB): بيانات المستخدم، الإعدادات
 * IndexedDB (300 MB): الطلبات، الشكاوى، بيانات الخريطة
 */

import { Request, Complaint } from '@/contexts/DataContext';
import { CompressionService } from './CompressionService';

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

export interface StorageStats {
  localStorageSize: number;
  indexedDBSize: number;
  totalSize: number;
  localStorageUsage: number; // percentage
  indexedDBUsage: number; // percentage
  itemCount: {
    users: number;
    requests: number;
    complaints: number;
    warehouses: number;
  };
  lastSync: string;
  compressionRatio: number;
}

interface IndexedDBData {
  requests: Request[];
  complaints: Complaint[];
  mapData?: any[];
  mapCache?: Record<string, any>;
}

interface LocalStorageData {
  users: StoredUser[];
  currentUser: StoredUser | null;
  userPreferences: Record<string, any>;
  warehouses: StoredWarehouse[];
  appSettings: Record<string, any>;
  lastSync: string;
}

class AdvancedStorageServiceClass {
  private static readonly LOCAL_STORAGE_KEY = 'port-navigator-local-data';
  private static readonly INDEXEDDB_NAME = 'port-navigator-idb';
  private static readonly INDEXEDDB_VERSION = 2;
  private static readonly USER_KEY = 'port-navigator-user';
  private static readonly SETTINGS_KEY = 'port-navigator-settings';
  
  // حدود التخزين
  private static readonly LOCAL_STORAGE_LIMIT = 100 * 1024 * 1024; // 100 MB
  private static readonly INDEXEDDB_LIMIT = 300 * 1024 * 1024; // 300 MB
  
  private db: IDBDatabase | null = null;
  private isInitialized: boolean = false;

  /**
   * تهيئة النظام
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (typeof window === 'undefined') {
      this.isInitialized = true;
      return;
    }

    try {
      await this.initIndexedDB();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Advanced Storage:', error);
      this.isInitialized = true; // Mark as initialized even if error
    }
  }

  /**
   * تهيئة IndexedDB
   */
  private initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        AdvancedStorageServiceClass.INDEXEDDB_NAME,
        AdvancedStorageServiceClass.INDEXEDDB_VERSION
      );

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;

        // إنشاء الـ Object Stores
        const stores = ['requests', 'complaints', 'mapData', 'mapCache'];
        stores.forEach((storeName) => {
          if (!database.objectStoreNames.contains(storeName)) {
            const store = database.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            
            // إضافة فهارس لتسريع البحث
            if (storeName === 'requests' || storeName === 'complaints') {
              store.createIndex('userId', 'userId', { unique: false });
              store.createIndex('status', 'status', { unique: false });
              store.createIndex('date', 'date', { unique: false });
            }
          }
        });
      };
    });
  }

  /**
   * حفظ الطلبات في IndexedDB
   */
  async addRequest(request: Request): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const dbRequest = store.add(request);

      dbRequest.onsuccess = () => {
        console.log('Request saved to IndexedDB:', request.id);
        resolve();
      };
      dbRequest.onerror = () => reject(dbRequest.error);
    });
  }

  /**
   * استرجاع جميع الطلبات
   */
  async getRequests(userId?: string): Promise<Request[]> {
    await this.initialize();
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['requests'], 'readonly');
      const store = transaction.objectStore('requests');
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result as Request[];
        if (userId) {
          results = results.filter((r) => r.userId === userId);
        }
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  }

  /**
   * تحديث الطلب
   */
  async updateRequest(request: Request): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const dbRequest = store.put(request);

      dbRequest.onsuccess = () => resolve();
      dbRequest.onerror = () => reject(dbRequest.error);
    });
  }

  /**
   * حذف الطلب
   */
  async deleteRequest(id: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * حفظ الشكوى
   */
  async addComplaint(complaint: Complaint): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['complaints'], 'readwrite');
      const store = transaction.objectStore('complaints');
      const dbRequest = store.add(complaint);

      dbRequest.onsuccess = () => {
        console.log('Complaint saved to IndexedDB:', complaint.id);
        resolve();
      };
      dbRequest.onerror = () => reject(dbRequest.error);
    });
  }

  /**
   * استرجاع جميع الشكاوى
   */
  async getComplaints(userId?: string): Promise<Complaint[]> {
    await this.initialize();
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['complaints'], 'readonly');
      const store = transaction.objectStore('complaints');
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result as Complaint[];
        if (userId) {
          results = results.filter((c) => c.userId === userId || c.createdBy === userId);
        }
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  }

  /**
   * تحديث الشكوى
   */
  async updateComplaint(complaint: Complaint): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['complaints'], 'readwrite');
      const store = transaction.objectStore('complaints');
      const dbRequest = store.put(complaint);

      dbRequest.onsuccess = () => resolve();
      dbRequest.onerror = () => reject(dbRequest.error);
    });
  }

  /**
   * حذف الشكوى
   */
  async deleteComplaint(id: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['complaints'], 'readwrite');
      const store = transaction.objectStore('complaints');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * حفظ بيانات الخريطة المضغوطة
   */
  async saveMapData(key: string, data: any): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    const compressed = CompressionService.compress(data);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['mapData'], 'readwrite');
      const store = transaction.objectStore('mapData');
      const request = store.put({ id: key, data: compressed, timestamp: Date.now() });

      request.onsuccess = () => {
        console.log('Map data saved and compressed:', key);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * استرجاع بيانات الخريطة
   */
  async getMapData(key: string): Promise<any | null> {
    await this.initialize();
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['mapData'], 'readonly');
      const store = transaction.objectStore('mapData');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as any;
        if (result) {
          try {
            const decompressed = CompressionService.decompress(result.data);
            resolve(decompressed);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }

  /**
   * حفظ المستخدم (localStorage)
   */
  setCurrentUser(user: StoredUser | null): void {
    try {
      if (user) {
        localStorage.setItem(AdvancedStorageServiceClass.USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AdvancedStorageServiceClass.USER_KEY);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  /**
   * استرجاع المستخدم
   */
  getCurrentUser(): StoredUser | null {
    try {
      const user = localStorage.getItem(AdvancedStorageServiceClass.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading user:', error);
      return null;
    }
  }

  /**
   * حفظ الإعدادات (localStorage)
   */
  saveSettings(settings: Record<string, any>): void {
    try {
      localStorage.setItem(
        AdvancedStorageServiceClass.SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * استرجاع الإعدادات
   */
  getSettings(): Record<string, any> {
    try {
      const settings = localStorage.getItem(AdvancedStorageServiceClass.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {};
    } catch {
      return {};
    }
  }

  /**
   * حفظ المخازن (localStorage)
   */
  setWarehouses(warehouses: StoredWarehouse[]): void {
    try {
      localStorage.setItem(
        'port-navigator-warehouses',
        JSON.stringify(warehouses)
      );
    } catch (error) {
      console.error('Error saving warehouses:', error);
    }
  }

  /**
   * استرجاع المخازن
   */
  getWarehouses(): StoredWarehouse[] {
    try {
      const data = localStorage.getItem('port-navigator-warehouses');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * حساب اجمالي حجم التخزين
   */
  getStorageSize(): number {
    try {
      let totalSize = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      return totalSize;
    } catch {
      return 0;
    }
  }

  /**
   * الحصول على إحصائيات التخزين الشاملة
   */
  async getStorageStats(): Promise<StorageStats> {
    await this.initialize();

    const localStorage_Size = this.getStorageSize();
    const localStorage_Usage = (localStorage_Size / AdvancedStorageServiceClass.LOCAL_STORAGE_LIMIT) * 100;

    // حساب حجم IndexedDB تقريباً
    const requests = await this.getRequests();
    const complaints = await this.getComplaints();
    const warehouses = this.getWarehouses();
    
    const requestsSize = JSON.stringify(requests).length;
    const complaintsSize = JSON.stringify(complaints).length;
    const warehousesSize = JSON.stringify(warehouses).length;
    
    const indexedDBEstimatedSize = requestsSize + complaintsSize + warehousesSize;
    const indexedDBUsage = (indexedDBEstimatedSize / AdvancedStorageServiceClass.INDEXEDDB_LIMIT) * 100;

    return {
      localStorageSize: localStorage_Size,
      indexedDBSize: indexedDBEstimatedSize,
      totalSize: localStorage_Size + indexedDBEstimatedSize,
      localStorageUsage: Math.min(localStorage_Usage, 100),
      indexedDBUsage: Math.min(indexedDBUsage, 100),
      itemCount: {
        users: 1, // Current user
        requests: requests.length,
        complaints: complaints.length,
        warehouses: warehouses.length,
      },
      lastSync: new Date().toISOString(),
      compressionRatio: CompressionService.getCompressionRatio({ requests, complaints }),
    };
  }

  /**
   * مسح جميع البيانات من IndexedDB
   */
  async clearIndexedDB(): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('IndexedDB not initialized');

    const stores = ['requests', 'complaints', 'mapData', 'mapCache'];
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * مسح جميع البيانات من localStorage
   */
  clearLocalStorage(): void {
    try {
      localStorage.removeItem(AdvancedStorageServiceClass.LOCAL_STORAGE_KEY);
      localStorage.removeItem(AdvancedStorageServiceClass.USER_KEY);
      localStorage.removeItem(AdvancedStorageServiceClass.SETTINGS_KEY);
      localStorage.removeItem('port-navigator-warehouses');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * مسح كل شيء
   */
  async clearAll(): Promise<void> {
    this.clearLocalStorage();
    await this.clearIndexedDB();
  }

  /**
   * تصدير جميع البيانات (Backup)
   */
  async exportData(): Promise<string> {
    await this.initialize();

    const requests = await this.getRequests();
    const complaints = await this.getComplaints();
    const currentUser = this.getCurrentUser();
    const warehouses = this.getWarehouses();
    const settings = this.getSettings();

    const exportData = {
      version: 2,
      timestamp: new Date().toISOString(),
      data: {
        currentUser,
        requests,
        complaints,
        warehouses,
        settings,
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * استيراد البيانات (Restore)
   */
  async importData(jsonString: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonString);
      
      if (importedData.data.currentUser) {
        this.setCurrentUser(importedData.data.currentUser);
      }

      if (importedData.data.warehouses) {
        this.setWarehouses(importedData.data.warehouses);
      }

      if (importedData.data.settings) {
        this.saveSettings(importedData.data.settings);
      }

      await this.initialize();
      if (this.db) {
        // Clear existing data
        await this.clearIndexedDB();

        // Import requests
        if (importedData.data.requests && Array.isArray(importedData.data.requests)) {
          for (const request of importedData.data.requests) {
            await this.addRequest(request);
          }
        }

        // Import complaints
        if (importedData.data.complaints && Array.isArray(importedData.data.complaints)) {
          for (const complaint of importedData.data.complaints) {
            await this.addComplaint(complaint);
          }
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid import data format');
    }
  }

  /**
   * تنظيف البيانات القديمة تلقائياً
   */
  async autoCleanup(daysToKeep: number = 90): Promise<number> {
    await this.initialize();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    let deletedCount = 0;

    // تنظيف الطلبات القديمة
    const requests = await this.getRequests();
    for (const req of requests) {
      if (new Date(req.date) < cutoffDate && req.status !== 'pending') {
        await this.deleteRequest(req.id);
        deletedCount++;
      }
    }

    // تنظيف الشكاوى القديمة المحلولة
    const complaints = await this.getComplaints();
    for (const complaint of complaints) {
      if (new Date(complaint.date) < cutoffDate && complaint.status === 'resolved') {
        await this.deleteComplaint(complaint.id);
        deletedCount++;
      }
    }

    console.log(`Cleanup completed: ${deletedCount} items deleted`);
    return deletedCount;
  }
}

// Singleton instance
export const AdvancedStorageService = new AdvancedStorageServiceClass();
