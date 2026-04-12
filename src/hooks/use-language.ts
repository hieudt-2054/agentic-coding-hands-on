'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'lang';
const DEFAULT_LANGUAGE = 'vn';

export function useLanguage() {
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLanguageState(stored);
    } catch {
      // localStorage not available (SSR or private mode) — keep default
    }
  }, []);

  const setLanguage = (lang: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage not available — update state only
    }
    setLanguageState(lang);
  };

  return { language, setLanguage };
}
