import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook لإدارة localStorage بشكل آمن وسهل
 * يحفظ البيانات تلقائياً ويسترجعها عند إعادة التحميل
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State لتخزين القيمة
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading from localStorage (key: ${key}):`, error);
      return initialValue;
    }
  });

  // دالة لتحديث القيمة وحفظها
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // إرسال event لإخبار الـ tabs الأخرى بالتغيير
          window.dispatchEvent(
            new CustomEvent('local-storage-change', {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.error(`Error saving to localStorage (key: ${key}):`, error);
      }
    },
    [key, storedValue]
  );

  // مراقبة تغييرات storage من tabs أخرى
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing storage change (key: ${key}):`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // دالة لحذف البيانات
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}
