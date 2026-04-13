import Image from 'next/image';
import { fetchEventConfig } from '@/services/homepage-service';
import PrelaunchCountdown from '@/components/prelaunch/PrelaunchCountdown';

export default async function PrelaunchPage() {
  let eventConfig = null;

  try {
    eventConfig = await fetchEventConfig();
  } catch {
    // Fallback to null on error
  }

  return (
    <div
      className="relative"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-page)',
        overflow: 'hidden',
      }}
    >
      {/* Background keyvisual */}
      <Image
        src="/assets/homepage/images/keyvisual.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        style={{ objectFit: 'cover' }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--color-prelaunch-gradient)',
          zIndex: 1,
        }}
      />

      {/* Content — centered countdown */}
      <div
        className="relative flex items-center justify-center"
        style={{
          minHeight: '100vh',
          zIndex: 2,
          padding: '96px 144px',
        }}
      >
        {eventConfig ? (
          <PrelaunchCountdown targetDatetime={eventConfig.targetDatetime} />
        ) : (
          <h1
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'var(--text-prelaunch-heading-size)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              textAlign: 'center',
            }}
          >
            Coming soon
          </h1>
        )}
      </div>
    </div>
  );
}
