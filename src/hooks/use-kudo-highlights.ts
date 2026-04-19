'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchKudosHighlightsClient } from '@/services/kudos-client';
import type { Highlight, KudoFilter } from '@/types/kudos';

export const kudoHighlightsKey = (filter: KudoFilter) => ['kudos-highlights', filter] as const;

export function useKudoHighlights(filter: KudoFilter = {}, initialData?: Highlight[]) {
  return useQuery({
    queryKey: kudoHighlightsKey(filter),
    queryFn: () => fetchKudosHighlightsClient(filter),
    initialData,
    staleTime: 30_000,
  });
}
