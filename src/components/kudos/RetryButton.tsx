'use client';

interface RetryButtonProps {
  onRetry: () => void;
  label?: string;
}

export default function RetryButton({ onRetry, label = 'Thử lại' }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onRetry}
      style={{
        padding: '8px 20px',
        background: 'var(--color-btn-primary-bg, #FFEA9E)',
        color: 'var(--color-btn-primary-text, #00101A)',
        borderRadius: 8,
        border: 'none',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
