import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginButton from '@/components/login/LoginButton';

export default function LoginPage() {
  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ backgroundColor: 'var(--color-bg-page)' }}
    >
      {/* A_Header */}
      <Header />

      {/* C_Keyvisual — background artwork (absolute, full canvas) */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <Image
          src="/assets/login/images/root-further.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Rectangle 57 — left-to-right gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--color-gradient-hero)' }}
        />
        {/* Cover — bottom-to-top gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--color-gradient-footer)' }}
        />
      </div>

      {/* B_Bìa — Hero section */}
      <main
        className="relative flex flex-col"
        style={{
          zIndex: 1,
          flex: 1,
          padding: 'var(--spacing-hero-py) var(--spacing-hero-px)',
          gap: 'var(--spacing-hero-gap)',
        }}
      >
        {/* B.1_Key Visual — ROOT FURTHER brand image */}
        <div className="key-visual" style={{ width: '451px', height: '200px', flexShrink: 0 }}>
          <Image
            src="/assets/login/images/root-further.png"
            alt="ROOT FURTHER"
            width={451}
            height={200}
            style={{ width: '451px', height: '200px', objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Frame 550 — content + login button */}
        <div
          className="flex flex-col"
          style={{ gap: '24px', paddingLeft: '16px' }}
        >
          {/* B.2_content — Hero description */}
          <p
            style={{
              maxWidth: '480px',
              fontSize: 'var(--text-hero-cta-size)',
              fontWeight: 'var(--text-hero-cta-weight)',
              lineHeight: 'var(--text-hero-cta-line-height)',
              letterSpacing: 'var(--text-hero-cta-letter-spacing)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            Bắt đầu hành trình của bạn cùng SAA 2025.
            <br />
            Đăng nhập để khám phá!
          </p>

          {/* B.3_Login — LoginButton + error state */}
          <LoginButton />
        </div>
      </main>

      {/* D_Footer */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  );
}
