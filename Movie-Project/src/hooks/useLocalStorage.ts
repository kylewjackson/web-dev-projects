import { useState, useEffect } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState(() => {
    const localStorageObject = localStorage.getItem(key);
    if (!localStorageObject) {
      return initialValue;
    }
    try {
      return JSON.parse(localStorageObject) as T;
    } catch (error) {
      console.error(`Failed to parse local watchlist JSON: ${error}`);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
