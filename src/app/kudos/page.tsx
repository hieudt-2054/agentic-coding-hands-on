import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import WidgetButton from '@/components/homepage/WidgetButton';
import KudosHero from '@/components/kudos/KudosHero';
import SectionTitle from '@/components/kudos/SectionTitle';
import HighlightSection from '@/components/kudos/HighlightSection';
import AllKudosSection from '@/components/kudos/AllKudosSection';
import SpotlightCanvas from '@/components/kudos/SpotlightCanvas';
import SectionErrorBoundary from '@/components/kudos/SectionErrorBoundary';
import { KudoFilterProvider } from '@/components/kudos/KudoFilterContext';
import { fetchKudosHighlights, fetchKudosFeed } from '@/services/kudos-service';
import { createClient } from '@/libs/supabase/server';
import { getDictionary } from '@/i18n/get-dictionary';
import type { Highlight, KudosFeedPage } from '@/types/kudos';

export default async function KudosPage() {
  const dict = await getDictionary();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const viewerId = userData.user?.id ?? null;

  let initialHighlights: Highlight[] = [];
  let initialFeedPage: KudosFeedPage = { items: [], nextCursor: null };
  try {
    initialHighlights = await fetchKudosHighlights({});
  } catch {
    // keep defaults
  }
  try {
    initialFeedPage = await fetchKudosFeed({ limit: 10 });
  } catch {
    // keep defaults
  }

  return (
    <div className="kudos-page-shell">
      <AppHeader activeNavKey="kudos" />
      <main
        className="flex flex-col"
        style={{
          padding: 'var(--spacing-page-py) var(--spacing-page-px)',
          gap: 'var(--spacing-kudos-section-gap, 40px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <KudosHero dict={dict} />

        <KudoFilterProvider>
          {/* Section order per spec: Highlight → Spotlight → All Kudos */}
          <HighlightSection
            viewerId={viewerId}
            initialHighlights={initialHighlights}
            eventCaption={dict['kudos.section.event']}
            highlightTitle={dict['kudos.section.highlight']}
          />

          <section className="flex flex-col" style={{ gap: 24 }}>
            <SectionTitle
              caption={dict['kudos.section.event']}
              title={dict['kudos.section.spotlight']}
            />
            <SectionErrorBoundary>
              <SpotlightCanvas />
            </SectionErrorBoundary>
          </section>

          <AllKudosSection
            viewerId={viewerId}
            initialFeedPage={initialFeedPage}
            eventCaption={dict['kudos.section.event']}
            allTitle={dict['kudos.section.all']}
          />
        </KudoFilterProvider>
      </main>
      <AppFooter dict={dict} />
      <WidgetButton />
    </div>
  );
}
