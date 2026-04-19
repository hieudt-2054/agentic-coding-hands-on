'use client';

import { Component, type ReactNode } from 'react';
import RetryButton from '@/components/kudos/RetryButton';

interface SectionErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

export default class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Kudos section error:', error);
    }
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      this.props.fallback ?? (
        <div
          role="alert"
          className="flex flex-col items-center"
          style={{
            gap: 16,
            padding: 48,
            textAlign: 'center',
            color: 'var(--color-text-secondary, #DBD1C1)',
          }}
        >
          <p>Không tải được nội dung. Vui lòng thử lại.</p>
          <RetryButton onRetry={this.reset} />
        </div>
      )
    );
  }
}
