'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { KudoFilter } from '@/types/kudos';

interface KudoFilterContextValue {
  filter: KudoFilter;
  hasFilter: boolean;
  setHashtag: (slug: string | undefined) => void;
  setDepartment: (id: string | undefined) => void;
  selectHashtag: (slug: string) => void;
}

const KudoFilterContext = createContext<KudoFilterContextValue | null>(null);

interface KudoFilterProviderProps {
  children: React.ReactNode;
}

export function KudoFilterProvider({ children }: KudoFilterProviderProps) {
  const [filter, setFilter] = useState<KudoFilter>({});

  const setHashtag = useCallback(
    (slug: string | undefined) => setFilter(prev => ({ ...prev, hashtag: slug })),
    []
  );
  const setDepartment = useCallback(
    (id: string | undefined) => setFilter(prev => ({ ...prev, department: id })),
    []
  );
  const selectHashtag = useCallback(
    (slug: string) => setFilter(prev => ({ ...prev, hashtag: slug })),
    []
  );

  const value = useMemo<KudoFilterContextValue>(
    () => ({
      filter,
      hasFilter: Boolean(filter.hashtag || filter.department),
      setHashtag,
      setDepartment,
      selectHashtag,
    }),
    [filter, setHashtag, setDepartment, selectHashtag]
  );

  return <KudoFilterContext.Provider value={value}>{children}</KudoFilterContext.Provider>;
}

export function useKudoFilter(): KudoFilterContextValue {
  const ctx = useContext(KudoFilterContext);
  if (!ctx) throw new Error('useKudoFilter must be called inside <KudoFilterProvider>');
  return ctx;
}
