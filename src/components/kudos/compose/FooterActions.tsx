'use client';

import SubmitTooltip from './SubmitTooltip';

interface FooterActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  missingFields: string[];
}

export default function FooterActions({
  onCancel,
  onSubmit,
  isSubmitting,
  isValid,
  missingFields,
}: FooterActionsProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--spacing-modal-footer-gap, 24px)',
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        style={{
          padding: '10px 24px',
          borderRadius: 'var(--radius-modal-cancel, 4px)',
          border: '1px solid var(--color-btn-secondary-border, #998C5F)',
          background: 'transparent',
          color: 'var(--color-kudos-text-on-light, #00101A)',
          fontSize: 'var(--text-body, 16px)',
          fontWeight: 600,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1,
        }}
      >
        Hủy
      </button>

      <SubmitTooltip missingFields={missingFields}>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          aria-disabled={!isValid || isSubmitting}
          style={{
            padding: '10px 32px',
            borderRadius: 8,
            border: 'none',
            background: isValid && !isSubmitting
              ? 'var(--color-btn-primary-bg, #FFEA9E)'
              : 'rgba(255, 234, 158, 0.4)',
            color: 'var(--color-btn-primary-text, #00101A)',
            fontSize: 'var(--text-submit, 22px)',
            lineHeight: 'var(--text-submit-line-height, 28px)',
            fontWeight: 700,
            cursor: !isValid || isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background 150ms ease-in-out',
          }}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi'}
        </button>
      </SubmitTooltip>
    </div>
  );
}
