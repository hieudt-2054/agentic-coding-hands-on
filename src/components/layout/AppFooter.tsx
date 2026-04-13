import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = [
  { key: 'about-saa', label: 'About SAA 2025', href: '#' },
  { key: 'awards', label: 'Awards Information', href: '#' },
  { key: 'kudos', label: 'Sun* Kudos', href: '#' },
] as const;

export default function AppFooter() {
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
          {NAV_LINKS.map((link) => (
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
        &copy; 2025 Sun* Inc. All rights reserved.
      </p>
    </footer>
  );
}
