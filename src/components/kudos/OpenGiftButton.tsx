'use client';

import Icon from '@/components/kudos/Icon';
import { useOpenSecretBox } from '@/hooks/use-open-secret-box';
import { useTranslation } from '@/i18n/use-translation';

interface OpenGiftButtonProps {
  unopenedCount: number;
}

export default function OpenGiftButton({ unopenedCount }: OpenGiftButtonProps) {
  const { mutate, isPending } = useOpenSecretBox();
  const { t } = useTranslation();
  const disabled = unopenedCount <= 0 || isPending;

  return (
    <button
      type="button"
      onClick={() => mutate()}
      disabled={disabled}
      className="kudos-open-gift-btn"
      title={unopenedCount <= 0 ? t('kudos.stats.noGifts') : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 60,
        width: '100%',
        maxWidth: 374,
        padding: 16,
        borderRadius: 'var(--radius-kudos-open-gift, 8px)',
        background: 'var(--color-text-gold, #FFEA9E)',
        color: 'var(--color-kudos-text-on-light, #00101A)',
        border: 'none',
        fontSize: 22,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon name="open-gift" size={24} />
      <span>{t('kudos.stats.openGift')}</span>
    </button>
  );
}
