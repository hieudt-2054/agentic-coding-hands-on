import Link from 'next/link';

const buttonBase: React.CSSProperties = {
  width: 276,
  height: 60,
  padding: '16px 24px',
  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
  fontSize: 'var(--text-cta-btn-size)',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
};

export default function CTAButtons() {
  return (
    <div className="cta-buttons flex items-center" style={{ gap: 'var(--spacing-cta-gap)' }}>
      {/* TODO: update when routes confirmed */}
      <Link
        href="#"
        className="cta-primary"
        style={{
          ...buttonBase,
          backgroundColor: 'var(--color-btn-primary-bg)',
          color: 'var(--color-btn-primary-text)',
          borderRadius: 'var(--radius-btn-primary)',
          transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out',
        }}
      >
        ABOUT AWARDS
      </Link>
      {/* TODO: update when routes confirmed */}
      <Link
        href="#"
        className="cta-secondary"
        style={{
          ...buttonBase,
          backgroundColor: 'var(--color-btn-secondary-bg)',
          color: 'var(--color-text-primary)',
          borderRadius: 'var(--radius-btn-secondary)',
          border: '1px solid var(--color-btn-secondary-border)',
          transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out',
        }}
      >
        ABOUT KUDOS
      </Link>
    </div>
  );
}
