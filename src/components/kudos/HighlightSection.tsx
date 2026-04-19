'use client';

import HighlightCarousel from '@/components/kudos/HighlightCarousel';
import SectionErrorBoundary from '@/components/kudos/SectionErrorBoundary';
import DropdownFilter from '@/components/kudos/DropdownFilter';
import SectionTitle from '@/components/kudos/SectionTitle';
import { useKudoFilter } from '@/components/kudos/KudoFilterContext';
import { useTranslation } from '@/i18n/use-translation';
import type { Highlight } from '@/types/kudos';

interface HighlightSectionProps {
  viewerId: string | null;
  initialHighlights: Highlight[];
  eventCaption: string;
  highlightTitle: string;
}

export default function HighlightSection({
  viewerId,
  initialHighlights,
  eventCaption,
  highlightTitle,
}: HighlightSectionProps) {
  const { t } = useTranslation();
  const { filter, hasFilter, setHashtag, setDepartment, selectHashtag } = useKudoFilter();

  return (
    <section className="flex flex-col" style={{ gap: 24 }}>
      <SectionTitle caption={eventCaption} title={highlightTitle}>
        <div className="flex" style={{ gap: 12, flexWrap: 'wrap' }}>
          <DropdownFilter
            kind="hashtag"
            label={t('kudos.filter.hashtag')}
            value={filter.hashtag}
            onChange={setHashtag}
          />
          <DropdownFilter
            kind="department"
            label={t('kudos.filter.department')}
            value={filter.department}
            onChange={setDepartment}
          />
        </div>
      </SectionTitle>

      <SectionErrorBoundary>
        <HighlightCarousel
          filter={filter}
          viewerId={viewerId}
          initialData={hasFilter ? undefined : initialHighlights}
          onHashtagSelect={selectHashtag}
        />
      </SectionErrorBoundary>
    </section>
  );
}
