import Image from 'next/image';
import PillCTA from '@/components/kudos/PillCTA';
import type { Dictionary } from '@/i18n/dictionaries/vi';

interface KudosHeroProps {
  dict: Dictionary;
}

export default function KudosHero({ dict }: KudosHeroProps) {
  return (
    <section
      className="flex flex-col"
      style={{ gap: 32, alignItems: 'center', padding: '64px 0 40px' }}
    >
      <h1
        style={{
          fontSize: 'var(--text-kudos-hero-size, 57px)',
          lineHeight: 'var(--text-kudos-hero-line-height, 64px)',
          letterSpacing: 'var(--text-kudos-hero-letter-spacing, -0.25px)',
          fontWeight: 700,
          color: 'var(--color-text-gold, #FFEA9E)',
          margin: 0,
          textAlign: 'center',
        }}
      >
        {dict['kudos.hero.slogan']}
      </h1>

      <Image
        src="/assets/kudos/logos/kudos-logo.svg"
        alt="Sun* Kudos"
        width={320}
        height={120}
        priority
      />

      <div
        className="flex kudos-hero-ctas"
        style={{ gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <PillCTA
          href="/kudos/compose"
          icon="pen"
          label={dict['kudos.hero.composePlaceholder']}
          width={738}
        />
        <PillCTA
          href="/kudos/search"
          icon="search"
          label={dict['kudos.hero.searchSunner']}
          width={381}
        />
      </div>
    </section>
  );
}
