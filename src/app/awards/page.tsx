import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import AwardsHeroKeyvisual from '@/components/awards/AwardsHeroKeyvisual';
import AwardsSectionTitle from '@/components/awards/AwardsSectionTitle';
import AwardDetailCard from '@/components/awards/AwardDetailCard';
import AwardsLayout from '@/components/awards/AwardsLayout';
import AwardsSidebar from '@/components/awards/AwardsSidebar';
import KudosSection from '@/components/homepage/KudosSection';
import { fetchAwardsFull } from '@/services/awards-service';
import { fetchKudos } from '@/services/homepage-service';
import { getDictionary } from '@/i18n/get-dictionary';
import type { AwardFull } from '@/types/awards';
import type { KudosInfo } from '@/types/homepage';

export default async function AwardsPage() {
  const dict = await getDictionary();
  let awards: AwardFull[] = [];
  let kudos: KudosInfo | null = null;

  try { awards = await fetchAwardsFull(); } catch {}
  try { kudos = await fetchKudos(); } catch {}

  const slugs = awards.map(a => ({ slug: a.slug, label: a.title }));

  return (
    <>
      <AppHeader activeNavKey="awards" />
      <AwardsHeroKeyvisual />
      <main className="flex flex-col" style={{
        padding: 'var(--spacing-page-py) var(--spacing-page-px)',
        gap: 'var(--spacing-section-gap)',
      }}>
        <AwardsSectionTitle dict={dict} />
        {awards.length > 0 ? (
          <AwardsLayout sidebar={<AwardsSidebar slugs={slugs} />}>
            <div className="flex flex-col" style={{ gap: 'var(--spacing-card-stack-gap)' }}>
              {awards.map(award => (
                <AwardDetailCard key={award.id} award={award} dict={dict} />
              ))}
            </div>
          </AwardsLayout>
        ) : (
          <p style={{ color: 'var(--color-text-primary)', textAlign: 'center', padding: '48px 0' }}>
            {dict['awards.empty']}
          </p>
        )}
        <KudosSection kudos={kudos} dict={dict} />
      </main>
      <AppFooter dict={dict} />
    </>
  );
}
