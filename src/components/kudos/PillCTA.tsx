import Link from 'next/link';
import Icon, { type KudosIconName } from '@/components/kudos/Icon';

interface PillCTAProps {
  href: string;
  icon: KudosIconName;
  label: string;
  width?: number;
}

export default function PillCTA({ href, icon, label, width }: PillCTAProps) {
  return (
    <Link
      href={href}
      className="kudos-pill-cta"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width,
        maxWidth: '100%',
        height: 72,
        padding: '24px 16px',
        borderRadius: 'var(--radius-kudos-pill, 68px)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
        background: 'var(--color-btn-secondary-bg, rgba(255, 234, 158, 0.10))',
        color: 'var(--color-text-primary, #FFFFFF)',
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: 0.15,
        textDecoration: 'none',
      }}
    >
      <Icon name={icon} size={24} />
      <span>{label}</span>
    </Link>
  );
}
