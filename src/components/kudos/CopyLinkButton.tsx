'use client';

import Icon from '@/components/kudos/Icon';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useTranslation } from '@/i18n/use-translation';

interface CopyLinkButtonProps {
  kudoId: string;
}

export default function CopyLinkButton({ kudoId }: CopyLinkButtonProps) {
  const copy = useCopyToClipboard();
  const { t } = useTranslation();

  const onClick = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    void copy(`${base}/kudos/${kudoId}`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="kudos-copy-link-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        border: 'none',
        padding: '4px 8px',
        color: 'var(--color-kudos-secondary-2, #2E3940)',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      <Icon name="link" size={20} />
      <span>{t('kudos.card.copyLink')}</span>
    </button>
  );
}
