import { screen } from '@testing-library/react';
import { renderWithQuery } from '../helpers/renderWithQuery';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

// Silence the SpotlightCanvas query — it uses the browser Supabase client which has no mock here
jest.mock('@/services/spotlight-client', () => ({
  fetchKudosSpotlightClient: jest.fn().mockResolvedValue({ totalCount: 0, entries: [] }),
}));

jest.mock('@/services/taxonomies-client', () => ({
  fetchHashtagsClient: jest.fn().mockResolvedValue([]),
  fetchDepartmentsClient: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/services/user-stats-client', () => ({
  fetchUserStatsClient: jest.fn().mockResolvedValue(null),
  fetchTopGiftRecipientsClient: jest.fn().mockResolvedValue([]),
  fetchUnopenedSecretBox: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/hooks/use-kudos-realtime', () => ({
  useKudosRealtime: () => ({ events: [], connected: false }),
}));

jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
  })),
}));

jest.mock('@/services/kudos-service', () => ({
  fetchKudosHighlights: jest.fn().mockResolvedValue([]),
  fetchKudosFeed: jest.fn().mockResolvedValue({ items: [], nextCursor: null }),
}));

import KudosPage from '@/app/kudos/page';

jest.mock('@/i18n/get-dictionary', () => ({
  getDictionary: jest.fn().mockResolvedValue({
    'common.nav.aboutSaa': 'About SAA 2025',
    'common.nav.awards': 'Awards Information',
    'common.nav.kudos': 'Sun* Kudos',
    'common.nav.menu': 'Menu',
    'common.nav.notifications': 'Notifications',
    'common.nav.account': 'Account',
    'common.copyright': '© Sun* 2025',
    'common.detail': 'Chi tiết',
    'common.detailArrow': 'Chi tiết →',
    'common.comingSoon': 'Coming soon',
    'kudos.hero.slogan': 'Hệ thống ghi nhận và cảm ơn',
    'kudos.hero.composePlaceholder': 'Placeholder',
    'kudos.hero.searchSunner': 'Tìm kiếm sunner',
    'kudos.section.event': 'Sun* Annual Awards 2025',
    'kudos.section.highlight': 'HIGHLIGHT KUDOS',
    'kudos.section.spotlight': 'SPOTLIGHT BOARD',
    'kudos.section.all': 'ALL KUDOS',
    'kudos.empty': 'Hiện tại chưa có Kudos nào.',
  }),
}));

jest.mock('@/i18n/use-translation', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe('/kudos page shell', () => {
  it('renders hero, all three section titles, and footer', async () => {
    const ui = await KudosPage();
    renderWithQuery(ui);

    expect(screen.getByRole('heading', { level: 1, name: 'Hệ thống ghi nhận và cảm ơn' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'HIGHLIGHT KUDOS' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'SPOTLIGHT BOARD' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'ALL KUDOS' })).toBeInTheDocument();
  });
});
