import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarNavItem from '@/components/awards/SidebarNavItem';

describe('SidebarNavItem', () => {
  const defaultProps = {
    label: 'Best Engineer',
    slug: 'best-engineer',
    isActive: false,
    onClick: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders label text', () => {
    render(<SidebarNavItem {...defaultProps} />);
    expect(screen.getByText('Best Engineer')).toBeInTheDocument();
  });

  it('calls onClick with slug when clicked', () => {
    render(<SidebarNavItem {...defaultProps} />);
    fireEvent.click(screen.getByText('Best Engineer'));
    expect(defaultProps.onClick).toHaveBeenCalledWith('best-engineer');
  });

  it('applies active class when isActive is true', () => {
    render(<SidebarNavItem {...defaultProps} isActive={true} />);
    const button = screen.getByText('Best Engineer');
    expect(button.className).toContain('sidebar-nav-item-active');
    expect(button).toHaveAttribute('aria-current', 'true');
  });

  it('does not apply active class when isActive is false', () => {
    render(<SidebarNavItem {...defaultProps} isActive={false} />);
    const button = screen.getByText('Best Engineer');
    expect(button.className).not.toContain('sidebar-nav-item-active');
    expect(button).not.toHaveAttribute('aria-current');
  });
});
