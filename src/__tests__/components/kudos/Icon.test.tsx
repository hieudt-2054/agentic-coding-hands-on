import { render } from '@testing-library/react';
import Icon from '@/components/kudos/Icon';

describe('<Icon>', () => {
  it('renders the requested svg with default size 24', () => {
    const { container } = render(<Icon name="pen" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toContain('/assets/kudos/icons/pen.svg');
    expect(img?.getAttribute('width')).toBe('24');
    expect(img?.getAttribute('height')).toBe('24');
    expect(img?.getAttribute('aria-hidden')).toBe('true');
  });

  it('respects a custom size and alt text', () => {
    const { container, getByAltText } = render(<Icon name="heart" size={32} alt="Hearts" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('32');
    expect(img?.getAttribute('height')).toBe('32');
    expect(getByAltText('Hearts')).toBeInTheDocument();
  });
});
