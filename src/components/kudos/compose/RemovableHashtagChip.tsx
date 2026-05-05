'use client';

interface RemovableHashtagChipProps {
  slug: string;
  onRemove: () => void;
}

export default function RemovableHashtagChip({ slug, onRemove }: RemovableHashtagChipProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        borderRadius: 9999,
        background: 'rgba(255, 234, 158, 0.40)',
        fontSize: 'var(--text-hashtag-chip, 11px)',
        fontWeight: 600,
        color: 'var(--color-kudos-text-on-light, #00101A)',
        lineHeight: 1.6,
      }}
    >
      #{slug}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Xóa hashtag ${slug}`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: '#D4271D',
          fontSize: 14,
          lineHeight: 1,
          borderRadius: 'var(--radius-modal-remove-btn, 9999px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ×
      </button>
    </span>
  );
}
