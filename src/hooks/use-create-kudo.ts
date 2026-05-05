'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createKudo } from '@/services/kudos-compose-client';
import type { ComposeKudoForm, ComposeKudoResult } from '@/types/compose-kudo';

export function useCreateKudo() {
  const queryClient = useQueryClient();

  return useMutation<ComposeKudoResult, Error, ComposeKudoForm>({
    mutationFn: createKudo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['kudos-feed'] });
      void queryClient.invalidateQueries({ queryKey: ['kudos-highlights'] });
      void queryClient.invalidateQueries({ queryKey: ['kudos-spotlight'] });
      void queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
}
