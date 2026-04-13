import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AwardsSidebar from '@/components/awards/AwardsSidebar';

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: mockObserve,
  unobserve: jest.fn(),
  disconnect: mockDisconnect,
}));

const mockSlugs = [
  { slug: 'best-engineer', label: 'Best Engineer' },
  { slug: 'best-design', label: 'Best Design' },
  { slug: 'best-team', label: 'Best Team' },
  { slug: 'best-mentor', label: 'Best Mentor' },
  { slug: 'best-innovation', label: 'Best Innovation' },
  { slug: 'best-culture', label: 'Best Culture' },
];

describe('AwardsSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.getElementById to return elements for each slug
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (mockSlugs.some(ms => ms.slug === id)) {
        const mockEl = document.createElement('div');
        mockEl.id = id;
        mockEl.scrollIntoView = jest.fn();
        return mockEl;
      }
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders 6 nav items with correct labels', () => {
    render(<AwardsSidebar slugs={mockSlugs} />);
    expect(screen.getByText('Best Engineer')).toBeInTheDocument();
    expect(screen.getByText('Best Design')).toBeInTheDocument();
    expect(screen.getByText('Best Team')).toBeInTheDocument();
    expect(screen.getByText('Best Mentor')).toBeInTheDocument();
    expect(screen.getByText('Best Innovation')).toBeInTheDocument();
    expect(screen.getByText('Best Culture')).toBeInTheDocument();
  });

  it('renders nav element with correct aria-label', () => {
    render(<AwardsSidebar slugs={mockSlugs} />);
    expect(screen.getByRole('navigation', { name: 'Danh m\u1ee5c gi\u1ea3i th\u01b0\u1edfng' })).toBeInTheDocument();
  });

  it('click fires callback and updates active state', () => {
    render(<AwardsSidebar slugs={mockSlugs} />);
    const designBtn = screen.getByText('Best Design');
    fireEvent.click(designBtn);
    expect(designBtn.className).toContain('sidebar-nav-item-active');
  });

  it('first slug is active by default', () => {
    render(<AwardsSidebar slugs={mockSlugs} />);
    const firstBtn = screen.getByText('Best Engineer');
    expect(firstBtn).toHaveAttribute('aria-current', 'true');
  });
});
