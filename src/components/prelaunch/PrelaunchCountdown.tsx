'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCountdown } from '@/hooks/use-countdown';
import { createClient } from '@/libs/supabase/client';
import GlassDigitBox from './GlassDigitBox';

interface PrelaunchCountdownProps {
  targetDatetime: string;
}

function splitDigits(value: number): [string, string] {
  const padded = String(value).padStart(2, '0');
  return [padded[0], padded[1]];
}

const UNITS = [
  { key: 'days', label: 'DAYS' },
  { key: 'hours', label: 'HOURS' },
  { key: 'minutes', label: 'MINUTES' },
] as const;

export default function PrelaunchCountdown({ targetDatetime }: PrelaunchCountdownProps) {
  const { days, hours, minutes, isExpired } = useCountdown(targetDatetime);
  const router = useRouter();

  useEffect(() => {
    if (!isExpired) return;
    const checkAuthAndRedirect = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      router.push(user ? '/' : '/auth/login');
    };
    checkAuthAndRedirect();
  }, [isExpired, router]);

  const values = { days, hours, minutes };

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: 24 }}
      aria-live="polite"
      aria-label="Countdown timer"
    >
      <h1
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: 'var(--text-prelaunch-heading-size)',
          fontWeight: 700,
          lineHeight: '48px',
          color: 'var(--color-text-primary)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Sự kiện sẽ bắt đầu sau
      </h1>

      <div
        className="flex items-center"
        style={{ gap: 'var(--spacing-prelaunch-unit-gap)' }}
      >
        {UNITS.map(({ key, label }) => {
          const [d1, d2] = splitDigits(values[key]);
          return (
            <div
              key={key}
              className="flex flex-col items-center"
              style={{ gap: 'var(--spacing-prelaunch-digit-label-gap)' }}
            >
              <div
                className="flex items-center"
                style={{ gap: 'var(--spacing-prelaunch-digit-gap)' }}
              >
                <GlassDigitBox digit={d1} />
                <GlassDigitBox digit={d2} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: 'var(--text-prelaunch-label-size)',
                  fontWeight: 700,
                  lineHeight: '48px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
