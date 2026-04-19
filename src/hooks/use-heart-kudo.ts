'use client';

import { useCallback, useRef } from 'react';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { toggleKudoHeart } from '@/services/gifts-client';
import { useToast } from '@/providers/ToastProvider';
import { useTranslation } from '@/i18n/use-translation';
import { trackEvent } from '@/libs/analytics';
import type { HeartToggleResult, KudoCard, KudosFeedPage } from '@/types/kudos';

const HEART_DEBOUNCE_MS = 400;

interface MutationContext {
  previousHighlights: Array<[readonly unknown[], KudoCard[] | undefined]>;
  previousFeed: Array<[readonly unknown[], InfiniteData<KudosFeedPage> | undefined]>;
}

function applyOptimisticHighlight(list: KudoCard[] | undefined, kudoId: string): KudoCard[] | undefined {
  if (!list) return list;
  return list.map(k => (k.id === kudoId ? toggleLocally(k) : k));
}

function applyOptimisticFeed(data: InfiniteData<KudosFeedPage> | undefined, kudoId: string) {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map(page => ({
      ...page,
      items: page.items.map(k => (k.id === kudoId ? toggleLocally(k) : k)),
    })),
  };
}

function toggleLocally(card: KudoCard): KudoCard {
  const nextLiked = !card.likedByMe;
  const delta = nextLiked ? 1 : -1;
  return { ...card, likedByMe: nextLiked, heartsCount: Math.max(0, card.heartsCount + delta) };
}

function applyResult(list: KudoCard[] | undefined, kudoId: string, result: HeartToggleResult) {
  if (!list) return list;
  return list.map(k =>
    k.id === kudoId ? { ...k, likedByMe: result.liked, heartsCount: result.count } : k
  );
}

function applyResultFeed(
  data: InfiniteData<KudosFeedPage> | undefined,
  kudoId: string,
  result: HeartToggleResult
) {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map(page => ({
      ...page,
      items: page.items.map(k =>
        k.id === kudoId ? { ...k, likedByMe: result.liked, heartsCount: result.count } : k
      ),
    })),
  };
}

export function useHeartKudo() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const lastCall = useRef<Record<string, number>>({});

  const mutation = useMutation<HeartToggleResult, Error, string, MutationContext>({
    mutationFn: (kudoId: string) => toggleKudoHeart(kudoId),

    onMutate: async (kudoId): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ['kudos-highlights'] });
      await queryClient.cancelQueries({ queryKey: ['kudos-feed'] });

      const previousHighlights = queryClient.getQueriesData<KudoCard[]>({ queryKey: ['kudos-highlights'] });
      const previousFeed = queryClient.getQueriesData<InfiniteData<KudosFeedPage>>({ queryKey: ['kudos-feed'] });

      for (const [key, data] of previousHighlights) {
        queryClient.setQueryData(key, applyOptimisticHighlight(data, kudoId));
      }
      for (const [key, data] of previousFeed) {
        queryClient.setQueryData(key, applyOptimisticFeed(data, kudoId));
      }
      return { previousHighlights, previousFeed };
    },

    onSuccess: (result, kudoId) => {
      queryClient.setQueriesData<KudoCard[]>({ queryKey: ['kudos-highlights'] }, data =>
        applyResult(data, kudoId, result)
      );
      queryClient.setQueriesData<InfiniteData<KudosFeedPage>>({ queryKey: ['kudos-feed'] }, data =>
        applyResultFeed(data, kudoId, result)
      );
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      trackEvent('kudo_heart', { kudo_id: kudoId, liked: result.liked });
    },

    onError: (error, _kudoId, context) => {
      if (context) {
        for (const [key, data] of context.previousHighlights) queryClient.setQueryData(key, data);
        for (const [key, data] of context.previousFeed) queryClient.setQueryData(key, data);
      }
      const msg = error.message;
      if (msg === 'rate_limited') showToast('error', t('kudos.heart.rateLimited'));
      else if (msg === 'cannot_heart_own_kudo') showToast('error', t('kudos.heart.selfDisabled'));
      else showToast('error', t('kudos.heart.error'));
    },
  });

  const toggle = useCallback(
    (kudoId: string) => {
      const now = Date.now();
      const last = lastCall.current[kudoId] ?? 0;
      if (now - last < HEART_DEBOUNCE_MS) return;
      lastCall.current[kudoId] = now;
      mutation.mutate(kudoId);
    },
    [mutation]
  );

  return { toggle, isPending: mutation.isPending };
}
