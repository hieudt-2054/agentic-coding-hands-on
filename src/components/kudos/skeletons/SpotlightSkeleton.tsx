export default function SpotlightSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        maxWidth: 1157,
        height: 548,
        margin: '0 auto',
        borderRadius: 'var(--radius-kudos-canvas, 47.14px)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
        background: 'var(--color-kudos-page, #00101A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-secondary, #DBD1C1)',
        animation: 'kudos-skeleton-pulse 1.2s ease-in-out infinite',
      }}
    >
      …
    </div>
  );
}
