'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProfileByIdClient } from '@/services/profiles-client';
import type { SunnerRef } from '@/types/kudos';

export function useProfileById(id: string | null | undefined) {
  return useQuery<SunnerRef | null, Error>({
    queryKey: ['profiles', id],
    queryFn: () => fetchProfileByIdClient(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}
