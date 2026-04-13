import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries/vi';

interface AppFooterProps {
  dict: Dictionary;
}

export default function AppFooter({ dict }: AppFooterProps) {
  return (
    <footer
      className="footer-content flex items-center justify-between"
      style={{
        width: '100%',
        padding: 'var(--spacing-footer-py) var(--spacing-footer-px)',
        borderTop: 'var(--border-footer-top)',
      }}
    >
      {/* Left: Logo + Nav */}
      <div className="footer-left flex items-center" style={{ gap: 'var(--spacing-footer-logo-nav-gap)' }}>
        <Image
          src="/assets/login/logos/saa-logo.png"
          alt="SAA Logo"
          width={69}
          height={64}
          loading="lazy"
        />

        <nav className="footer-nav flex items-center" style={{ gap: 'var(--spacing-footer-nav-gap)' }}>
          {([
            { key: 'about-saa', label: dict['common.nav.aboutSaa'], href: '#' },
            { key: 'awards', label: dict['common.nav.awards'], href: '#' },
            { key: 'kudos', label: dict['common.nav.kudos'], href: '#' },
          ] as const).map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="footer-nav-link"
              style={{
                fontSize: 'var(--text-nav-link-footer-size)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                transition: 'background-color 150ms ease-in-out',
                ...(link.key === 'about-saa'
                  ? {
                      backgroundColor: 'var(--color-nav-active-bg)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                    }
                  : {}),
              }}
              {...(link.key === 'about-saa' ? { 'aria-current': 'page' as const } : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Copyright */}
      <p
        style={{
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-montserrat-alt)',
          margin: 0,
        }}
      >
        {dict['common.copyright']}
      </p>
    </footer>
  );
}
