import { cookies } from 'next/headers';
import type { Locale } from './types';
import { DEFAULT_LOCALE } from './types';
import { getDictionaryByLocale } from './dictionaries';
import type { Dictionary } from './dictionaries/vi';

export type { Dictionary };

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value as Locale) || DEFAULT_LOCALE;
  return getDictionaryByLocale(lang);
}
