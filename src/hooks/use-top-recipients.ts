'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchTopGiftRecipientsClient } from '@/services/user-stats-client';

export const topRecipientsKey = ['gifts-top-recipients'] as const;

export function useTopRecipients() {
  return useQuery({
    queryKey: topRecipientsKey,
    queryFn: () => fetchTopGiftRecipientsClient(10),
    staleTime: 60_000,
  });
}
