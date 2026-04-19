'use client';

import { useEffect, useRef } from 'react';
import KudoCard from '@/components/kudos/KudoCard';
import KudoCardSkeleton from '@/components/kudos/skeletons/KudoCardSkeleton';
import RetryButton from '@/components/kudos/RetryButton';
import { useKudosFeed } from '@/hooks/use-kudos-feed';
import { useTranslation } from '@/i18n/use-translation';
import type { KudoFilter, KudosFeedPage } from '@/types/kudos';

interface KudoFeedProps {
  filter: KudoFilter;
  viewerId: string | null;
  initialPage?: KudosFeedPage;
  onHashtagSelect?: (slug: string) => void;
}

export default function KudoFeed({ filter, viewerId, initialPage, onHashtagSelect }: KudoFeedProps) {
  const { t } = useTranslation();
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useKudosFeed(filter, initialPage);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting) && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '400px 0px 0px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex flex-col" style={{ gap: 24 }}>
        <KudoCardSkeleton />
        <KudoCardSkeleton />
        <KudoCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center"
        style={{ gap: 16, padding: 48, textAlign: 'center', color: 'var(--color-text-secondary, #DBD1C1)' }}
      >
        <p>Không tải được danh sách Kudos.</p>
        <RetryButton onRetry={() => void refetch()} />
      </div>
    );
  }

  const items = data?.pages.flatMap(p => p.items) ?? [];

  if (items.length === 0) {
    return (
      <div
        role="status"
        style={{
          padding: 48,
          textAlign: 'center',
          color: 'var(--color-text-secondary, #DBD1C1)',
          borderRadius: 'var(--radius-kudos-card-feed, 24px)',
          border: '1px dashed var(--color-btn-secondary-border, #998C5F)',
        }}
      >
        {t('kudos.empty')}
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {items.map(k => (
        <KudoCard key={k.id} kudo={k} viewerId={viewerId} variant="feed" onHashtagSelect={onHashtagSelect} />
      ))}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
      {isFetchingNextPage && <KudoCardSkeleton />}
    </div>
  );
}
