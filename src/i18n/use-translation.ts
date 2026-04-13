'use client';

import { useLanguage } from '@/hooks/use-language';
import { getDictionaryByLocale } from './dictionaries';
import type { Locale } from './types';
import type { DictionaryKey } from './dictionaries/vi';

export function useTranslation() {
  const { language } = useLanguage();
  const dict = getDictionaryByLocale(language as Locale);

  const t = (key: DictionaryKey): string => {
    return dict[key] || key;
  };

  return { t, locale: language as Locale };
}
