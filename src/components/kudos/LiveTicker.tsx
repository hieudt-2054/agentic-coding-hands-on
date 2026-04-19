'use client';

import { useKudosRealtime } from '@/hooks/use-kudos-realtime';
import { useTranslation } from '@/i18n/use-translation';

function formatTime(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return iso;
  }
}

interface LiveTickerProps {
  variant?: 'overlay' | 'inline';
}

export default function LiveTicker({ variant = 'inline' }: LiveTickerProps) {
  const { events, connected } = useKudosRealtime();
  const { t, locale } = useTranslation();

  if (!connected || events.length === 0) return null;

  const latest = events[0];
  const template = t('kudos.spotlight.liveTicker');
  const text = template
    .replace('{time}', formatTime(latest.occurredAt, locale))
    .replace('{name}', latest.receiverName);

  const overlayStyle: React.CSSProperties =
    variant === 'overlay'
      ? { position: 'absolute', left: 16, bottom: 16, right: 16 }
      : {};

  return (
    <div
      className="kudos-ticker"
      aria-live="polite"
      aria-atomic="false"
      style={{
        color: 'var(--color-text-secondary, #DBD1C1)',
        fontSize: 14,
        fontWeight: 500,
        animation: 'kudos-ticker-fadein 200ms ease-out',
        ...overlayStyle,
      }}
    >
      {text}
    </div>
  );
}
