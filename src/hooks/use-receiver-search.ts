'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProfilesClient } from '@/services/profiles-client';
import type { SunnerRef } from '@/types/kudos';

export function useReceiverSearch(rawQuery: string) {
  const [debouncedQ, setDebouncedQ] = useState(rawQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(rawQuery), 300);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  return useQuery<SunnerRef[], Error>({
    queryKey: ['profiles-search', debouncedQ],
    queryFn: () => searchProfilesClient(debouncedQ, { excludeSelf: true }),
    enabled: debouncedQ.length >= 1,
    staleTime: 30_000,
  });
}
