import Image from 'next/image';
import LanguageToggle from '@/components/login/LanguageToggle';

export default function Header() {
  return (
    <header
      className="flex items-center justify-between"
      style={{
        width: '100%',
        height: '80px',
        padding: 'var(--spacing-header-py) var(--spacing-header-px)',
        backgroundColor: 'var(--color-header-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* A.1_Logo */}
      <div style={{ width: '52px', height: '56px', flexShrink: 0 }}>
        <Image
          src="/assets/login/logos/saa-logo.png"
          alt="SAA 2025"
          width={52}
          height={56}
          priority
        />
      </div>

      {/* A.2_Language */}
      <LanguageToggle />
    </header>
  );
}
