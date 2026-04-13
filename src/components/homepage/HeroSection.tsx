import Image from 'next/image';
import type { EventConfig } from '@/types/homepage';
import CountdownTimer from '@/components/homepage/CountdownTimer';
import EventInfo from '@/components/homepage/EventInfo';
import CTAButtons from '@/components/homepage/CTAButtons';

interface HeroSectionProps {
  eventConfig: EventConfig | null;
}

export default function HeroSection({ eventConfig }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center" style={{ gap: 40 }}>
      {/* Keyvisual background */}
      <Image
        src="/assets/homepage/images/keyvisual.png"
        alt="Key visual background"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', zIndex: 0 }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--color-keyvisual-gradient)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center"
        style={{ zIndex: 2, gap: 40 }}
      >
        {/* ROOT FURTHER logo */}
        <Image
          src="/assets/homepage/images/root-further-hero.png"
          alt="ROOT FURTHER"
          width={1224}
          height={200}
          priority
        />

        {eventConfig ? (
          <div className="flex flex-col items-center" style={{ gap: 16 }}>
            <CountdownTimer targetDatetime={eventConfig.targetDatetime} />
            <EventInfo
              time={eventConfig.time}
              venue={eventConfig.venue}
              streamNote={eventConfig.streamNote}
            />
            <CTAButtons />
          </div>
        ) : (
          <div className="flex flex-col items-center" style={{ gap: 16 }}>
            <CTAButtons />
          </div>
        )}
      </div>
    </section>
  );
}
