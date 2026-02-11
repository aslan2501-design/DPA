import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook لإدارة IndexedDB
 * يوفر تخزين محلي قوي (50MB+) مع دعم الـ queries المعقدة
 */

interface IndexedDBConfig {
  dbName: string;
  version: number;
  stores: Record<string, string>; // storeName: keyPath
}

export function useIndexedDB<T>(
  config: IndexedDBConfig,
  storeName: string
) {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // تهيئة قاعدة البيانات
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const initDB = () => {
      const request = indexedDB.open(config.dbName, config.version);

      request.onerror = () => {
        setError(new Error('Failed to open IndexedDB'));
        setLoading(false);
      };

      request.onsuccess = () => {
        setDb(request.result);
        setLoading(false);
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        
        // إنشاء Object Stores إذا لم تكن موجودة
        Object.entries(config.stores).forEach(([name, keyPath]) => {
          if (!database.objectStoreNames.contains(name)) {
            database.createObjectStore(name, { keyPath });
          }
        });
      };
    };

    initDB();
  }, [config.dbName, config.version, config.stores]);

  // إضافة سجل
  const add = useCallback(
    (item: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
    [db, storeName]
  );

  // تحديث سجل
  const update = useCallback(
    (item: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
    [db, storeName]
  );

  // حذف سجل
  const delete_ = useCallback(
    (key: IDBValidKey): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
    [db, storeName]
  );

  // استرجاع جميع السجلات
  const getAll = useCallback((): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }, [db, storeName]);

  // استرجاع سجل واحد
  const get = useCallback(
    (key: IDBValidKey): Promise<T | undefined> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }

        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result as T | undefined);
        request.onerror = () => reject(request.error);
      });
    },
    [db, storeName]
  );

  // حذف جميع السجلات
  const clear = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [db, storeName]);

  return { loading, error, add, update, delete: delete_, get, getAll, clear };
}
