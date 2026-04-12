'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';

const LANGUAGES = [
  { code: 'vn', label: 'Tiếng Việt', ariaLabel: 'Tiếng Việt' },
  { code: 'en', label: 'English', ariaLabel: 'English' },
] as const;

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center"
        style={{
          width: '108px',
          height: '56px',
          padding: 'var(--spacing-btn-lang-p)',
          borderRadius: 'var(--radius-btn-lang)',
          backgroundColor: isOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: '2px',
          transition: 'background-color 150ms ease-in-out',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLButtonElement).style.outline = '2px solid rgba(255,255,255,0.5)';
          (e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLButtonElement).style.outline = 'none';
        }}
      >
        <Image
          src="/assets/login/icons/vn-flag.svg"
          alt="Vietnam flag"
          width={24}
          height={24}
        />
        <span
          style={{
            fontSize: 'var(--text-lang-code-size)',
            fontWeight: 'var(--text-lang-code-weight)',
            lineHeight: 'var(--text-lang-code-line-height)',
            letterSpacing: 'var(--text-lang-code-letter-spacing)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-montserrat)',
          }}
        >
          {currentLang.code.toUpperCase()}
        </span>
        <Image
          src="/assets/login/icons/chevron-down.svg"
          alt="chevron"
          width={24}
          height={24}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease-in-out',
          }}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            backgroundColor: '#0B0F12',
            border: '1px solid var(--color-divider)',
            borderRadius: '4px',
            listStyle: 'none',
            padding: '4px 0',
            margin: 0,
            minWidth: '140px',
            zIndex: 20,
          }}
        >
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={language === lang.code}
              aria-label={lang.ariaLabel}
              onClick={() => handleSelect(lang.code)}
              style={{
                padding: '10px 16px',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'var(--font-montserrat)',
                backgroundColor: language === lang.code ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLIElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLIElement).style.backgroundColor =
                  language === lang.code ? 'rgba(255,255,255,0.08)' : 'transparent';
              }}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
