export default function StatsPanelSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        padding: 24,
        borderRadius: 'var(--radius-kudos-panel, 17px)',
        background: 'var(--color-kudos-panel, #00070C)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
        minHeight: 380,
        animation: 'kudos-skeleton-pulse 1.2s ease-in-out infinite',
      }}
    />
  );
}
