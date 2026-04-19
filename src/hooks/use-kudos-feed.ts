'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchKudosFeedClient } from '@/services/kudos-client';
import type { KudoFilter, KudosFeedPage } from '@/types/kudos';

export const kudosFeedKey = (filter: KudoFilter) => ['kudos-feed', filter] as const;

const PAGE_SIZE = 10;

export function useKudosFeed(filter: KudoFilter = {}, initialPage?: KudosFeedPage) {
  return useInfiniteQuery<KudosFeedPage, Error>({
    queryKey: kudosFeedKey(filter),
    queryFn: ({ pageParam }) =>
      fetchKudosFeedClient({
        filter,
        cursor: (pageParam as string | null) ?? null,
        limit: PAGE_SIZE,
      }),
    initialPageParam: null,
    getNextPageParam: last => last.nextCursor,
    initialData: initialPage
      ? {
          pages: [initialPage],
          pageParams: [null],
        }
      : undefined,
  });
}
