interface KudoCardSkeletonProps {
  variant?: 'highlight' | 'feed';
}

export default function KudoCardSkeleton({ variant = 'feed' }: KudoCardSkeletonProps) {
  const radius =
    variant === 'highlight'
      ? 'var(--radius-kudos-card-highlight, 16px)'
      : 'var(--radius-kudos-card-feed, 24px)';
  const minHeight = variant === 'highlight' ? 360 : 520;

  return (
    <div
      aria-hidden="true"
      style={{
        background: 'var(--color-kudos-card-cream, #FFF8E1)',
        borderRadius: radius,
        padding: 24,
        minHeight,
        opacity: 0.55,
        animation: 'kudos-skeleton-pulse 1.2s ease-in-out infinite',
      }}
    />
  );
}
