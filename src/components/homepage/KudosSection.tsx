import Link from 'next/link';
import Image from 'next/image';
import type { KudosInfo } from '@/types/homepage';
import type { Dictionary } from '@/i18n/dictionaries/vi';

interface KudosSectionProps {
  kudos: KudosInfo | null;
  dict: Dictionary;
}

export default function KudosSection({ kudos, dict }: KudosSectionProps) {
  if (!kudos) {
    return <></>;
  }

  return (
    <section
      className="flex justify-center"
      style={{ width: '100%', maxWidth: 1224, margin: '0 auto' }}
    >
      <div
        className="kudos-inner relative"
        style={{
          width: '100%',
          maxWidth: 1120,
          minHeight: 500,
          borderRadius: 'var(--radius-kudos-card)',
          overflow: 'hidden',
        }}
      >
        {/* Background image — full card */}
        {kudos.decorationImageUrl && (
          <Image
            src={kudos.decorationImageUrl}
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            aria-hidden="true"
          />
        )}

        {/* Content overlay */}
        <div
          className="relative flex justify-between kudos-content-wrapper"
          style={{
            width: '100%',
            height: '100%',
            minHeight: 500,
            padding: 52,
            zIndex: 1,
          }}
        >
          {/* Left — D2_Content */}
          <div
            className="flex flex-col"
            style={{
              width: 457,
              maxHeight: 408,
              gap: 'var(--spacing-kudos-content-gap)',
            }}
          >
            {/* Label */}
            <span
              style={{
                fontSize: 'var(--text-section-caption-size)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              {kudos.label}
            </span>

            {/* Title */}
            <h2
              style={{
                fontSize: 'var(--text-section-title-size)',
                fontWeight: 700,
                lineHeight: 'var(--text-section-title-line-height, 64px)',
                letterSpacing: '-0.25px',
                color: 'var(--color-text-gold)',
                margin: 0,
              }}
            >
              {kudos.title}
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: 'var(--color-text-primary)',
                textAlign: 'justify',
                margin: 0,
              }}
            >
              {kudos.description}
            </p>

            {/* Detail Button */}
            <Link
              href={kudos.detailUrl ?? '#'}
              className="kudos-detail-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 127,
                height: 56,
                padding: 16,
                backgroundColor: 'var(--color-btn-primary-bg)',
                color: 'var(--color-btn-primary-text)',
                borderRadius: 'var(--radius-btn-details)',
                fontSize: 'var(--text-kudos-btn-size)',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 150ms ease-in-out, transform 150ms ease-in-out',
              }}
            >
              {dict['common.detail']}
            </Link>
          </div>

          {/* Right — Decorative text overlay */}
          <div
            className="kudos-decoration flex items-center justify-center"
            style={{
              flexShrink: 0,
              width: 400,
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-svn-gotham)',
                fontSize: 96,
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                opacity: 0.6,
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              Sun* Kudos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
