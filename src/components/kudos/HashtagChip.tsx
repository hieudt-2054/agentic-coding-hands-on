'use client';

interface HashtagChipProps {
  label: string;
  slug: string;
  onSelect?: (slug: string) => void;
}

export default function HashtagChip({ label, slug, onSelect }: HashtagChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(slug)}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        color: 'var(--color-kudos-heart-active, #D4271D)',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: 0.15,
      }}
      className="kudos-hashtag-chip"
    >
      {label}
    </button>
  );
}
