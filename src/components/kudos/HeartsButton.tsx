'use client';

import { useHeartKudo } from '@/hooks/use-heart-kudo';
import { useTranslation } from '@/i18n/use-translation';

// Inlined so `fill` inherits from the button's `color` — next/image rasterises
// SVGs and strips currentColor inheritance.
function HeartIcon({ size = 20, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-4.534-9.33-9.17C1.16 8.67 3.16 5 6.5 5c2.05 0 3.46 1.1 4.5 2.5C12.04 6.1 13.45 5 15.5 5c3.34 0 5.34 3.67 3.83 6.83C19 16.47 12 21 12 21Z" />
    </svg>
  );
}

interface HeartsButtonProps {
  kudoId: string;
  count: number;
  likedByMe: boolean;
  isOwner: boolean;
}

function formatCount(n: number): string {
  if (n < 1000) return String(n);
  return n.toLocaleString('vi-VN');
}

export default function HeartsButton({ kudoId, count, likedByMe, isOwner }: HeartsButtonProps) {
  const { toggle, isPending } = useHeartKudo();
  const { t } = useTranslation();

  const disabled = isOwner;
  const label = `${likedByMe ? 'Bỏ thả tim' : 'Thả tim'} (${formatCount(count)})`;
  const title = disabled ? t('kudos.heart.selfDisabled') : undefined;

  return (
    <button
      type="button"
      onClick={() => !disabled && toggle(kudoId)}
      disabled={disabled || isPending}
      aria-pressed={likedByMe}
      aria-label={label}
      title={title}
      className={likedByMe ? 'kudos-heart-pulse' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        border: 'none',
        padding: '4px 8px',
        color: likedByMe
          ? 'var(--color-kudos-heart-active, #D4271D)'
          : 'var(--color-kudos-muted, #999999)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontSize: 16,
        fontWeight: 700,
        transition: 'color 150ms ease-in-out',
      }}
    >
      <HeartIcon size={20} filled={likedByMe} />
      <span style={{ color: 'var(--color-kudos-text-on-light, #00101A)' }}>{formatCount(count)}</span>
    </button>
  );
}
