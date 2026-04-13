interface SidebarNavItemProps {
  label: string;
  slug: string;
  isActive: boolean;
  onClick: (slug: string) => void;
}

export default function SidebarNavItem({ label, slug, isActive, onClick }: SidebarNavItemProps) {
  return (
    <button
      type="button"
      className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
      style={{
        padding: '12px 16px',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        color: isActive ? 'var(--color-text-gold)' : 'var(--color-text-primary)',
        textAlign: 'left',
      }}
      aria-current={isActive ? 'true' : undefined}
      onClick={() => onClick(slug)}
    >
      {label}
    </button>
  );
}
