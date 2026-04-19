'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageToggle from '@/components/login/LanguageToggle';
import { useTranslation } from '@/i18n/use-translation';

interface AppHeaderProps {
  activeNavKey: string;
}

export default function AppHeader({ activeNavKey }: AppHeaderProps) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NAV_LINKS = [
    { key: 'about-saa', label: t('common.nav.aboutSaa'), href: '/' },
    { key: 'awards', label: t('common.nav.awards'), href: '/awards' },
    { key: 'kudos', label: t('common.nav.kudos'), href: '/kudos' },
  ] as const;

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: 'var(--text-nav-link-size)',
    fontWeight: 700,
    color: isActive ? 'var(--color-text-gold)' : 'var(--color-text-primary)',
    textDecoration: isActive ? 'underline' : 'none',
    textUnderlineOffset: '4px',
    transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out',
  });

  const isActive = (key: string) => activeNavKey === key;

  return (
    <header
      className="flex items-center justify-between"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        height: '80px',
        padding: 'var(--spacing-header-py) var(--spacing-header-px)',
        backgroundColor: 'var(--color-app-header-bg)',
      }}
    >
      {/* Left side: Logo + Nav */}
      <div className="flex items-center" style={{ gap: '24px' }}>
        <Link href="#">
          <Image
            src="/assets/login/logos/saa-logo.png"
            alt="SAA Logo"
            width={52}
            height={48}
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center" style={{ gap: '24px' }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="nav-link"
              style={navLinkStyle(isActive(link.key))}
              {...(isActive(link.key) ? { 'aria-current': 'page' as const } : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right side: LanguageToggle + Bell + Avatar */}
      <div className="flex items-center" style={{ gap: '16px' }}>
        <LanguageToggle />

        <button
          aria-label={t('common.nav.notifications')}
          onClick={() => console.log('TODO: open notifications')}
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <Image
            src="/assets/homepage/icons/bell.svg"
            alt="Bell"
            width={24}
            height={24}
          />
        </button>

        <button
          aria-label={t('common.nav.account')}
          onClick={() => console.log('TODO: open profile')}
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: '1px solid var(--color-btn-secondary-border)',
            borderRadius: '9999px',
            cursor: 'pointer',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/assets/login/logos/saa-logo.png"
            alt="Avatar"
            width={32}
            height={32}
          />
        </button>

        {/* Mobile hamburger button */}
        <button
          className="flex md:hidden items-center justify-center"
          aria-label={t('common.nav.menu')}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: 'var(--color-text-primary)',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: 'var(--color-text-primary)',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: 'var(--color-text-primary)',
            }}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <nav
          className="flex md:hidden flex-col"
          style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-app-header-bg)',
            padding: '16px var(--spacing-header-px)',
            gap: '16px',
            zIndex: 10,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="nav-link"
              style={navLinkStyle(isActive(link.key))}
              onClick={closeMenu}
              {...(isActive(link.key) ? { 'aria-current': 'page' as const } : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
