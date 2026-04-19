'use client';

import Icon from '@/components/kudos/Icon';
import { useTranslation } from '@/i18n/use-translation';
import type { HoaThiLevel } from '@/types/kudos';

interface HoaThiBadgeProps {
  level: HoaThiLevel;
}

export default function HoaThiBadge({ level }: HoaThiBadgeProps) {
  const { t } = useTranslation();
  if (level <= 0) return null;

  const tooltipKey = (level === 1
    ? 'kudos.hoaThi.1'
    : level === 2
    ? 'kudos.hoaThi.2'
    : 'kudos.hoaThi.3') as 'kudos.hoaThi.1' | 'kudos.hoaThi.2' | 'kudos.hoaThi.3';

  return (
    <span
      className="inline-flex items-center"
      style={{ gap: 2, color: 'var(--color-text-gold, #FFEA9E)' }}
      title={t(tooltipKey)}
      aria-label={t(tooltipKey)}
    >
      {Array.from({ length: level }, (_, i) => (
        <Icon key={i} name="star" size={14} />
      ))}
    </span>
  );
}
