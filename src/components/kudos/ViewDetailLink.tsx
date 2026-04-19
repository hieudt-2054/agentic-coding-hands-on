'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/use-translation';

interface ViewDetailLinkProps {
  kudoId: string;
}

export default function ViewDetailLink({ kudoId }: ViewDetailLinkProps) {
  const { t } = useTranslation();
  return (
    <Link
      href={`/kudos/${kudoId}`}
      className="kudos-view-detail-link"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        color: 'var(--color-kudos-secondary-2, #2E3940)',
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
      }}
    >
      {t('kudos.card.viewDetail')}
    </Link>
  );
}
