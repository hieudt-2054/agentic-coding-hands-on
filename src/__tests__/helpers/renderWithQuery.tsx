import type { ReactElement } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToastProvider from '@/providers/ToastProvider';

export interface RenderWithQueryOptions extends Omit<RenderOptions, 'wrapper'> {
  client?: QueryClient;
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithQuery(
  ui: ReactElement,
  options: RenderWithQueryOptions = {}
): RenderResult & { client: QueryClient } {
  const { client = createTestQueryClient(), ...rest } = options;

  const result = render(
    <QueryClientProvider client={client}>
      <ToastProvider>{ui}</ToastProvider>
    </QueryClientProvider>,
    rest
  );

  return { ...result, client };
}
