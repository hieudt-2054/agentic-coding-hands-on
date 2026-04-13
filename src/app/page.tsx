import { fetchEventConfig, fetchAwards, fetchKudos } from '@/services/homepage-service';
import type { Award } from '@/types/homepage';
import type { KudosInfo } from '@/types/homepage';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import HeroSection from '@/components/homepage/HeroSection';
import RootFurtherSection from '@/components/homepage/RootFurtherSection';
import AwardsSection from '@/components/homepage/AwardsSection';
import KudosSection from '@/components/homepage/KudosSection';
import WidgetButton from '@/components/homepage/WidgetButton';

export default async function Home() {
  let eventConfig = null;
  let awards: Award[] = [];
  let kudos: KudosInfo | null = null;

  try {
    eventConfig = await fetchEventConfig();
  } catch {
    // Fallback to null on error
  }

  try {
    awards = await fetchAwards();
  } catch {
    // Fallback to empty array on error
  }

  try {
    kudos = await fetchKudos();
  } catch {
    // Fallback to null on error
  }

  return (
    <>
      <AppHeader activeNavKey="about-saa" />
      <main
        className="flex flex-col"
        style={{
          padding: 'var(--spacing-page-py) var(--spacing-page-px)',
          gap: 'var(--spacing-section-gap)',
        }}
      >
        <HeroSection eventConfig={eventConfig} />
        <RootFurtherSection />
        <AwardsSection awards={awards} />
        <KudosSection kudos={kudos} />
      </main>
      <AppFooter />
      <WidgetButton />
    </>
  );
}
