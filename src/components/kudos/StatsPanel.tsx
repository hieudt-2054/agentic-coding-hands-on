'use client';

import { useUserStats } from '@/hooks/use-user-stats';
import StatRow from '@/components/kudos/StatRow';
import OpenGiftButton from '@/components/kudos/OpenGiftButton';
import StatsPanelSkeleton from '@/components/kudos/skeletons/StatsPanelSkeleton';
import { useTranslation } from '@/i18n/use-translation';

export default function StatsPanel() {
  const { data, isPending, isError } = useUserStats();
  const { t } = useTranslation();

  if (isPending) return <StatsPanelSkeleton />;
  if (isError || !data) {
    return (
      <div
        role="alert"
        style={{
          padding: 24,
          textAlign: 'center',
          color: 'var(--color-text-secondary, #DBD1C1)',
        }}
      >
        Không tải được thống kê.
      </div>
    );
  }

  return (
    <section
      className="flex flex-col"
      style={{
        gap: 10,
        padding: 24,
        borderRadius: 'var(--radius-kudos-panel, 17px)',
        background: 'var(--color-kudos-panel, #00070C)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
      }}
      aria-label="Stats"
    >
      <StatRow label={t('kudos.stats.received')} value={data.kudosReceived} />
      <StatRow label={t('kudos.stats.sent')} value={data.kudosSent} />
      <StatRow
        label={t('kudos.stats.hearts')}
        value={data.heartsReceived}
        multiplier={data.doubleHeartActive}
      />
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--color-divider, #2E3940)',
          margin: '4px 0',
        }}
      />
      <StatRow label={t('kudos.stats.boxOpened')} value={data.secretBoxOpened} />
      <StatRow label={t('kudos.stats.boxUnopened')} value={data.secretBoxUnopened} />
      <div style={{ marginTop: 8 }}>
        <OpenGiftButton unopenedCount={data.secretBoxUnopened} />
      </div>
    </section>
  );
}
