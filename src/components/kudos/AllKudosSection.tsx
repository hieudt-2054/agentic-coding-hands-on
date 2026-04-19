'use client';

import KudoFeed from '@/components/kudos/KudoFeed';
import StatsPanel from '@/components/kudos/StatsPanel';
import TopRecipientsPanel from '@/components/kudos/TopRecipientsPanel';
import SectionErrorBoundary from '@/components/kudos/SectionErrorBoundary';
import LiveTicker from '@/components/kudos/LiveTicker';
import SectionTitle from '@/components/kudos/SectionTitle';
import { useKudoFilter } from '@/components/kudos/KudoFilterContext';
import type { KudosFeedPage } from '@/types/kudos';

interface AllKudosSectionProps {
  viewerId: string | null;
  initialFeedPage: KudosFeedPage;
  eventCaption: string;
  allTitle: string;
}

const twoColStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 422px)',
  gap: 'var(--spacing-kudos-two-col-gap, 40px)',
  alignItems: 'flex-start',
};

export default function AllKudosSection({
  viewerId,
  initialFeedPage,
  eventCaption,
  allTitle,
}: AllKudosSectionProps) {
  const { filter, hasFilter, selectHashtag } = useKudoFilter();

  return (
    <section className="flex flex-col" style={{ gap: 24 }}>
      <SectionTitle caption={eventCaption} title={allTitle} />

      <div className="kudos-two-col" style={twoColStyle}>
        <div style={{ minWidth: 0, width: '100%' }}>
          <SectionErrorBoundary>
            <KudoFeed
              filter={filter}
              viewerId={viewerId}
              initialPage={hasFilter ? undefined : initialFeedPage}
              onHashtagSelect={selectHashtag}
            />
          </SectionErrorBoundary>
        </div>

        <aside
          className="flex flex-col"
          style={{ gap: 'var(--spacing-kudos-feed-gap, 24px)', minWidth: 0 }}
        >
          <SectionErrorBoundary>
            <StatsPanel />
          </SectionErrorBoundary>
          <SectionErrorBoundary>
            <TopRecipientsPanel />
          </SectionErrorBoundary>
          <LiveTicker />
        </aside>
      </div>
    </section>
  );
}
