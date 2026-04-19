'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openSecretBox } from '@/services/gifts-client';
import { fetchUnopenedSecretBox } from '@/services/user-stats-client';
import { useToast } from '@/providers/ToastProvider';
import type { OpenGiftResult } from '@/types/kudos';

export function useOpenSecretBox() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<OpenGiftResult, Error>({
    mutationFn: async () => {
      const boxId = await fetchUnopenedSecretBox();
      if (!boxId) throw new Error('no_unopened_box');
      return openSecretBox(boxId);
    },
    onSuccess: result => {
      showToast('success', `🎁 ${result.giftDescription}`);
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['gifts-top-recipients'] });
    },
    onError: err => {
      if (err.message === 'no_unopened_box') {
        // Button should already be disabled — silent fallback.
        return;
      }
      showToast('error', 'Không thể mở quà, vui lòng thử lại');
    },
  });
}
