import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginButton from '@/components/login/LoginButton';

// Mock auth-service
jest.mock('@/services/auth-service', () => ({
  signInWithGoogle: jest.fn(),
}));

import { signInWithGoogle } from '@/services/auth-service';

const mockSignInWithGoogle = signInWithGoogle as jest.MockedFunction<typeof signInWithGoogle>;

describe('LoginButton', () => {
  beforeEach(() => {
    mockSignInWithGoogle.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders "LOGIN With Google" text', () => {
    render(<LoginButton />);
    expect(screen.getByText(/LOGIN With Google/i)).toBeInTheDocument();
  });

  it('renders Google icon', () => {
    render(<LoginButton />);
    expect(screen.getByRole('img', { name: /google/i })).toBeInTheDocument();
  });

  it('calls signInWithGoogle on click', async () => {
    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('disables button while loading', async () => {
    // signInWithGoogle hangs so we can observe loading state
    mockSignInWithGoogle.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  it('shows spinner instead of Google icon when loading', async () => {
    mockSignInWithGoogle.mockImplementation(() => new Promise(() => {}));

    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.queryByRole('img', { name: /google/i })).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('displays error message below button when error occurs', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Authentication failed'));

    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/Authentication failed/i);
    });
  });

  it('error element has aria-live="assertive"', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Auth error'));

    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  it('re-enables button after error', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Auth error'));

    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
