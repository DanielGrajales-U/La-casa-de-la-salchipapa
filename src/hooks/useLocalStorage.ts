import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, getInitialValue: () => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        if (parsed !== null && parsed !== undefined) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage read errors in restricted environments
    }
    return getInitialValue();
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write errors in restricted environments
    }
  }, [key, value]);

  return [value, setValue] as const;
}
