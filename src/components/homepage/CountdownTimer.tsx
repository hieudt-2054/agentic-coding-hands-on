'use client';

import { useCountdown } from '@/hooks/use-countdown';
import { useTranslation } from '@/i18n/use-translation';
import CountdownUnit from '@/components/homepage/CountdownUnit';

interface CountdownTimerProps {
  targetDatetime: string;
}

export default function CountdownTimer({ targetDatetime }: CountdownTimerProps) {
  const { days, hours, minutes, isExpired } = useCountdown(targetDatetime);
  const { t } = useTranslation();

  const UNITS = [
    { key: 'days', labelKey: 'home.countdown.days' as const },
    { key: 'hours', labelKey: 'home.countdown.hours' as const },
    { key: 'minutes', labelKey: 'home.countdown.minutes' as const },
  ];

  const values = { days, hours, minutes };

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: 16 }}
      aria-live="polite"
      aria-label="Countdown timer"
    >
      {!isExpired && (
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          {t('common.comingSoon')}
        </span>
      )}
      <div
        className="flex items-center justify-center"
        style={{ gap: 'var(--spacing-countdown-gap)' }}
      >
        {UNITS.map((unit) => (
          <CountdownUnit
            key={unit.key}
            value={values[unit.key as keyof typeof values]}
            label={t(unit.labelKey)}
          />
        ))}
      </div>
    </div>
  );
}
