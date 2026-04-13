import type { Locale } from './types';
import { DEFAULT_LOCALE } from './types';
import type { Dictionary } from './dictionaries/vi';
import vi from './dictionaries/vi';
import en from './dictionaries/en';

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionaryByLocale(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
