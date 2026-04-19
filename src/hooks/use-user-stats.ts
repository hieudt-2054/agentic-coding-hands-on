'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserStatsClient } from '@/services/user-stats-client';

export const userStatsKey = ['user-stats'] as const;

export function useUserStats() {
  return useQuery({
    queryKey: userStatsKey,
    queryFn: fetchUserStatsClient,
    staleTime: 30_000,
  });
}
