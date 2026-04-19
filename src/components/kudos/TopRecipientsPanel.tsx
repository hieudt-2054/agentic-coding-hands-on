'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTopRecipients } from '@/hooks/use-top-recipients';
import TopRecipientsSkeleton from '@/components/kudos/skeletons/TopRecipientsSkeleton';
import { useTranslation } from '@/i18n/use-translation';

export default function TopRecipientsPanel() {
  const { data, isPending, isError } = useTopRecipients();
  const { t } = useTranslation();

  if (isPending) return <TopRecipientsSkeleton />;
  if (isError) {
    return (
      <div role="alert" style={{ padding: 24, color: 'var(--color-text-secondary, #DBD1C1)' }}>
        Không tải được danh sách.
      </div>
    );
  }

  return (
    <section
      className="flex flex-col"
      style={{
        gap: 16,
        padding: '24px 16px 24px 24px',
        borderRadius: 'var(--radius-kudos-panel, 17px)',
        background: 'var(--color-kudos-panel, #00070C)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
      }}
      aria-label={t('kudos.topRecipients.title')}
    >
      <h3
        style={{
          fontSize: 20,
          lineHeight: '28px',
          fontWeight: 700,
          color: 'var(--color-text-gold, #FFEA9E)',
          margin: 0,
          whiteSpace: 'pre-line',
        }}
      >
        {t('kudos.topRecipients.title')}
      </h3>

      {data && data.length > 0 ? (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map(r => (
            <li key={`${r.userId}-${r.openedAt}`}>
              <Link
                href={`/users/${r.userId}`}
                className="flex items-center kudos-recipient-row"
                style={{
                  gap: 12,
                  padding: '8px 12px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: 'var(--color-text-primary, #FFFFFF)',
                }}
              >
                <Image
                  src={r.avatarUrl ?? '/assets/kudos/images/avatar-placeholder.svg'}
                  alt=""
                  width={40}
                  height={40}
                  style={{ borderRadius: 9999, objectFit: 'cover' }}
                />
                <div className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.displayName}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--color-text-secondary, #DBD1C1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.giftDescription}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'var(--color-text-secondary, #DBD1C1)', margin: 0 }}>
          {t('kudos.topRecipients.empty')}
        </p>
      )}
    </section>
  );
}
