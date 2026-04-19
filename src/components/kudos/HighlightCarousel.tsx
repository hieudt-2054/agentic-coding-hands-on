'use client';

import { useEffect, useRef, useState } from 'react';
import KudoCard from '@/components/kudos/KudoCard';
import KudoCardSkeleton from '@/components/kudos/skeletons/KudoCardSkeleton';
import Icon from '@/components/kudos/Icon';
import { useKudoHighlights } from '@/hooks/use-kudo-highlights';
import { useTranslation } from '@/i18n/use-translation';
import type { Highlight, KudoFilter } from '@/types/kudos';

// Card dimensions (design-style.md B.3): active card is 528px wide, 24px gap.
// Viewport is wider than a single card so the previous/next cards peek in
// on both sides, matching the Figma design.
const CARD_WIDTH = 528;
const CARD_GAP = 24;
// 528 (active) + 2 × 24 (gaps) + 2 × 264 (half-card peeks) = 1104px
const VIEWPORT_MAX = 1104;

interface HighlightCarouselProps {
  filter: KudoFilter;
  viewerId: string | null;
  initialData?: Highlight[];
  onHashtagSelect?: (slug: string) => void;
}

export default function HighlightCarousel({
  filter,
  viewerId,
  initialData,
  onHashtagSelect,
}: HighlightCarouselProps) {
  const { data = [], isPending, isError } = useKudoHighlights(filter, initialData);
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIndex(0);
  }, [filter]);

  const total = data.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  const prev = () => hasPrev && setIndex(i => i - 1);
  const next = () => hasNext && setIndex(i => i + 1);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const handle = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Home') setIndex(0);
      else if (e.key === 'End') setIndex(total - 1);
    };
    el.addEventListener('keydown', handle);
    return () => el.removeEventListener('keydown', handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (isPending) {
    return (
      <div className="flex" style={{ gap: 24, justifyContent: 'center' }}>
        <KudoCardSkeleton variant="highlight" />
        <KudoCardSkeleton variant="highlight" />
        <KudoCardSkeleton variant="highlight" />
      </div>
    );
  }

  if (isError || data.length === 0) {
    return (
      <div
        role="status"
        style={{
          padding: 48,
          textAlign: 'center',
          color: 'var(--color-text-secondary, #DBD1C1)',
          borderRadius: 'var(--radius-kudos-card-highlight, 16px)',
          border: '1px dashed var(--color-btn-secondary-border, #998C5F)',
        }}
      >
        {t('kudos.empty')}
      </div>
    );
  }

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={t('kudos.section.highlight')}
      className="kudos-carousel"
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <div
        className="flex items-center"
        style={{ gap: 24, justifyContent: 'center', position: 'relative' }}
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          disabled={!hasPrev}
          style={arrowStyle('left', !hasPrev)}
        >
          <Icon name="chevron-left" size={24} />
        </button>

        {/* Viewport: wider than one card so the previous/next cards peek in on
            both sides. Active card is kept centered via translate = (50% - cardW/2). */}
        <div
          className="kudos-carousel-viewport"
          style={{
            overflow: 'hidden',
            flex: 1,
            minWidth: 0,
            maxWidth: VIEWPORT_MAX,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: CARD_GAP,
              transform: `translateX(calc(50% - ${CARD_WIDTH / 2}px - ${
                index * (CARD_WIDTH + CARD_GAP)
              }px))`,
              transition: 'transform 300ms ease-out',
            }}
          >
            {data.map((k, i) => (
              <div key={k.id} style={{ flexShrink: 0, width: CARD_WIDTH }}>
                <KudoCard
                  kudo={k}
                  viewerId={viewerId}
                  variant="highlight"
                  active={i === index}
                  onHashtagSelect={onHashtagSelect}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next"
          disabled={!hasNext}
          style={arrowStyle('right', !hasNext)}
        >
          <Icon name="chevron-right" size={24} />
        </button>
      </div>

      <div
        className="flex items-center justify-center"
        style={{ gap: 32, marginTop: 16, color: 'var(--color-text-gold, #FFEA9E)', fontWeight: 700 }}
        aria-live="polite"
      >
        <span>
          {index + 1}/{total}
        </span>
      </div>
    </div>
  );
}

function arrowStyle(side: 'left' | 'right', disabled: boolean): React.CSSProperties {
  return {
    flexShrink: 0,
    width: 48,
    height: 48,
    borderRadius: 9999,
    background: 'var(--color-btn-secondary-bg, rgba(255,234,158,0.10))',
    border: '1px solid var(--color-btn-secondary-border, #998C5F)',
    color: 'var(--color-text-gold, #FFEA9E)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    padding: 0,
    marginInline: side === 'left' ? 0 : 0,
  };
}
