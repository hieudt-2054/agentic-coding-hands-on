'use client';

import { useCallback } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { useTranslation } from '@/i18n/use-translation';

export function useCopyToClipboard() {
  const { showToast } = useToast();
  const { t } = useTranslation();

  return useCallback(
    async (text: string): Promise<boolean> => {
      const ok = await writeToClipboard(text);
      if (ok) showToast('success', t('kudos.card.copied'));
      else showToast('error', t('kudos.card.copyFailed'));
      return ok;
    },
    [showToast, t]
  );
}

async function writeToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through
    }
  }
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }
  return false;
}
