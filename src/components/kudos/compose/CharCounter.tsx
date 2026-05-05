'use client';

interface CharCounterProps {
  value: number;
  max: number;
  threshold: number;
}

export default function CharCounter({ value, max, threshold }: CharCounterProps) {
  if (value < threshold) return null;

  const isOver = value > max;
  return (
    <span
      style={{
        fontSize: 'var(--text-body-sm, 14px)',
        color: isOver ? 'var(--color-kudos-heart-active, #D4271D)' : 'var(--color-kudos-secondary-2, #2E3940)',
        fontWeight: isOver ? 700 : 400,
      }}
      aria-live="polite"
    >
      {value}/{max}
    </span>
  );
}
