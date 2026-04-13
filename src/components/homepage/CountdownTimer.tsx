'use client';

import { useCountdown } from '@/hooks/use-countdown';
import CountdownUnit from '@/components/homepage/CountdownUnit';

interface CountdownTimerProps {
  targetDatetime: string;
}

export default function CountdownTimer({ targetDatetime }: CountdownTimerProps) {
  const { days, hours, minutes, isExpired } = useCountdown(targetDatetime);

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
          Coming soon
        </span>
      )}
      <div
        className="flex items-center justify-center"
        style={{ gap: 'var(--spacing-countdown-gap)' }}
      >
        <CountdownUnit value={days} label="Days" />
        <CountdownUnit value={hours} label="Hours" />
        <CountdownUnit value={minutes} label="Minutes" />
      </div>
    </div>
  );
}
