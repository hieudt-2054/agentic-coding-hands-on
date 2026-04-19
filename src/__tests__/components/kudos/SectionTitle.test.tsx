import { render, screen } from '@testing-library/react';
import SectionTitle from '@/components/kudos/SectionTitle';

describe('<SectionTitle>', () => {
  it('renders caption and title', () => {
    render(<SectionTitle caption="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />);
    expect(screen.getByText('Sun* Annual Awards 2025')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'HIGHLIGHT KUDOS' })).toBeInTheDocument();
  });

  it('renders trailing children slot (e.g. filter buttons)', () => {
    render(
      <SectionTitle caption="Sub" title="Main">
        <button>Filter</button>
      </SectionTitle>
    );
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });
});
