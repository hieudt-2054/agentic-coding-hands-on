import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function KudosSearchStubPage() {
  const dict = await getDictionary();
  return (
    <>
      <AppHeader activeNavKey="kudos" />
      <main
        className="flex flex-col items-center justify-center"
        style={{ minHeight: '60vh', padding: 'var(--spacing-page-py) var(--spacing-page-px)' }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-text-gold, #FFEA9E)' }}>
          Tìm kiếm Sunner
        </h1>
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary, #DBD1C1)' }}>
          {dict['kudos.stub.comingSoon']}
        </p>
      </main>
      <AppFooter dict={dict} />
    </>
  );
}
