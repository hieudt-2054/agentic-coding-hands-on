'use client';

export default function WidgetButton() {
  return (
    <button
      className="widget-btn"
      aria-label="Quick actions"
      onClick={() => console.log('TODO: open quick action menu overlay')}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '19px',
        width: '106px',
        height: '64px',
        backgroundColor: 'var(--color-btn-primary-bg)',
        borderRadius: 'var(--radius-widget)',
        boxShadow: 'var(--shadow-card-glow)',
        padding: '16px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        transition: 'box-shadow 150ms ease-in-out, transform 150ms ease-in-out',
        zIndex: 20,
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget;
        btn.style.boxShadow = '0 6px 8px 0 rgba(0,0,0,0.35), 0 0 12px 0 #FAE287';
        btn.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget;
        btn.style.boxShadow = 'var(--shadow-card-glow)';
        btn.style.transform = 'translateY(0)';
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/homepage/icons/pencil.svg"
        alt="Pencil"
        width={24}
        height={24}
      />
      <span
        style={{
          fontSize: 'var(--text-widget-slash-size)',
          fontWeight: 700,
          color: 'var(--color-btn-primary-text)',
          lineHeight: 1,
        }}
      >
        /
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/homepage/icons/saa-icon.svg"
        alt="SAA icon"
        width={20}
        height={19}
      />
    </button>
  );
}
