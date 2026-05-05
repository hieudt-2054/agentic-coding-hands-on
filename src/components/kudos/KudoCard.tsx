'use client';

import KudoHeader from '@/components/kudos/KudoHeader';
import HashtagChip from '@/components/kudos/HashtagChip';
import HeartsButton from '@/components/kudos/HeartsButton';
import CopyLinkButton from '@/components/kudos/CopyLinkButton';
import ViewDetailLink from '@/components/kudos/ViewDetailLink';
import ImageGallery from '@/components/kudos/ImageGallery';
import { sanitizeKudoHtml } from '@/libs/html-sanitiser';
import type { KudoCard as KudoCardType } from '@/types/kudos';

interface KudoCardProps {
  kudo: KudoCardType;
  viewerId: string | null;
  variant?: 'highlight' | 'feed';
  active?: boolean;
  onHashtagSelect?: (slug: string) => void;
}

const MAX_HASHTAGS = 5;
const MAX_IMAGES = 5;

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const M = String(d.getMonth() + 1).padStart(2, '0');
    const D = String(d.getDate()).padStart(2, '0');
    const Y = d.getFullYear();
    return `${hh}:${mm} - ${M}/${D}/${Y}`;
  } catch {
    return iso;
  }
}

export default function KudoCard({
  kudo,
  viewerId,
  variant = 'feed',
  active = false,
  onHashtagSelect,
}: KudoCardProps) {
  const clamp = variant === 'highlight' ? 3 : 5;
  const padding = variant === 'highlight' ? '24px 24px 16px 24px' : '40px 40px 16px 40px';
  const radius =
    variant === 'highlight'
      ? 'var(--radius-kudos-card-highlight, 16px)'
      : 'var(--radius-kudos-card-feed, 24px)';
  const border = variant === 'highlight' && active ? '4px solid var(--color-kudos-heart-accent, #FFEA9E)' : 'none';
  const opacity = variant === 'highlight' && !active ? 0.5 : 1;
  const transform = variant === 'highlight' && !active ? 'scale(0.92)' : 'none';

  const visibleHashtags = kudo.hashtags.slice(0, MAX_HASHTAGS);
  const hasMoreHashtags = kudo.hashtags.length > MAX_HASHTAGS;

  return (
    <article
      className={variant === 'feed' ? 'kudos-card-feed' : 'kudos-card-highlight'}
      style={{
        width: '100%',
        maxWidth: variant === 'highlight' ? 528 : 680,
        background: 'var(--color-kudos-card-cream, #FFF8E1)',
        borderRadius: radius,
        padding,
        border,
        opacity,
        transform,
        transition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        color: 'var(--color-kudos-text-on-light, #00101A)',
      }}
      aria-label={`Kudo ${kudo.sender?.displayName ?? 'Ẩn danh'} tặng ${kudo.receiver.displayName}`}
    >
      <KudoHeader sender={kudo.sender} receiver={kudo.receiver} variant={variant} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'var(--color-kudos-secondary-2, #2E3940)',
          fontSize: 14,
          fontWeight: 500,
          flexWrap: 'wrap',
        }}
      >
        <time dateTime={kudo.createdAt}>{formatTimestamp(kudo.createdAt)}</time>
      </div>

      {kudo.contentHtml ? (
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-kudos-text-on-light, #00101A)',
            margin: 0,
            padding: '16px 20px',
            borderRadius: 12,
            background: 'var(--color-kudos-card-cream-active, #FAE287)',
            lineHeight: '24px',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeKudoHtml(kudo.contentHtml) }}
        />
      ) : (
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-kudos-text-on-light, #00101A)',
            margin: 0,
            padding: '16px 20px',
            borderRadius: 12,
            background: 'var(--color-kudos-card-cream-active, #FAE287)',
            lineHeight: '24px',
            display: '-webkit-box',
            WebkitLineClamp: clamp,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {kudo.content}
        </p>
      )}

      {kudo.images.length > 0 && variant === 'feed' && (
        <ImageGallery images={kudo.images.slice(0, MAX_IMAGES)} />
      )}

      {visibleHashtags.length > 0 && (
        <div className="flex items-center" style={{ gap: 8, flexWrap: 'wrap', overflow: 'hidden' }}>
          {visibleHashtags.map(h => (
            <HashtagChip key={h.id} slug={h.slug} label={h.label} onSelect={onHashtagSelect} />
          ))}
          {hasMoreHashtags && <span style={{ fontSize: 14, color: 'var(--color-kudos-muted, #999999)' }}>…</span>}
        </div>
      )}

      <div
        className="flex items-center justify-between"
        style={{ gap: 16, borderTop: '1px solid rgba(46,57,64,0.1)', paddingTop: 12, flexWrap: 'wrap' }}
      >
        <HeartsButton
          kudoId={kudo.id}
          count={kudo.heartsCount}
          likedByMe={kudo.likedByMe}
          isOwner={viewerId === (kudo.sender?.id ?? null)}
        />
        <div className="flex items-center" style={{ gap: 8 }}>
          <CopyLinkButton kudoId={kudo.id} />
          <ViewDetailLink kudoId={kudo.id} />
        </div>
      </div>
    </article>
  );
}
