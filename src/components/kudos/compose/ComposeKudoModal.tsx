'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ComposeKudoProvider, useComposeKudo } from './ComposeKudoProvider';
import ModalBackdrop from './ModalBackdrop';
import ModalTitle from './ModalTitle';
import ReceiverAutocomplete from './ReceiverAutocomplete';
import DanhHieuInput from './DanhHieuInput';
import HashtagField from './HashtagField';
import FooterActions from './FooterActions';
import { useCreateKudo } from '@/hooks/use-create-kudo';
import type { SunnerRef } from '@/types/kudos';

interface ComposeKudoModalProps {
  variant: 'intercepted' | 'fullpage';
  initialReceiver?: SunnerRef | null;
}

function getMissingFields(
  receiverId: string,
  danhHieu: string,
  contentHtml: string,
  hashtags: string[]
): string[] {
  const missing: string[] = [];
  if (!receiverId) missing.push('Người nhận');
  if (!danhHieu.trim()) missing.push('Danh hiệu');
  if (!contentHtml.trim()) missing.push('Nội dung');
  if (hashtags.length === 0) missing.push('Hashtag');
  return missing;
}

function ModalInner({
  onClose,
  initialReceiver,
}: {
  onClose: () => void;
  initialReceiver?: SunnerRef | null;
}) {
  const { state, dispatch } = useComposeKudo();
  const { mutate, isPending } = useCreateKudo();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLDivElement>(null);

  // Set initial receiver
  useEffect(() => {
    if (initialReceiver) {
      dispatch({ type: 'setReceiver', payload: initialReceiver });
    }
  }, [initialReceiver, dispatch]);

  // Focus trap
  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const missingFields = getMissingFields(
    state.receiverId,
    state.danhHieu,
    state.contentHtml,
    state.hashtags
  );
  const isValid = missingFields.length === 0;

  const handleSubmit = useCallback(() => {
    if (!isValid || isPending) return;
    mutate(
      {
        receiverId: state.receiverId,
        danhHieu: state.danhHieu,
        contentHtml: state.contentHtml,
        hashtags: state.hashtags,
        images: state.images,
        isAnonymous: state.isAnonymous,
      },
      {
        onSuccess: () => {
          dispatch({ type: 'resetForm' });
          onClose();
        },
        onError: (err) => {
          dispatch({ type: 'setError', payload: { field: 'submit', message: err.message } });
        },
      }
    );
  }, [isValid, isPending, mutate, state, dispatch, onClose]);

  return (
    <>
      <ModalBackdrop onClose={onClose} />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-modal-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001,
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--color-kudos-card-cream, #FFF8E1)',
          borderRadius: 'var(--radius-modal-card, 24px)',
          padding: 'var(--spacing-modal-padding, 40px)',
          boxShadow: 'var(--shadow-kudos-modal, 0 16px 40px rgba(0,0,0,0.50))',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-modal-section, 32px)',
        }}
      >
        <div id="compose-modal-title">
          <ModalTitle />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-modal-field-row, 16px)' }}>
          {/* Receiver */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 'var(--text-field-label, 22px)',
                fontWeight: 700,
                color: 'var(--color-kudos-text-on-light, #00101A)',
              }}
            >
              Gửi đến <span style={{ color: 'var(--color-kudos-required-star, #CF1322)' }}>*</span>
            </label>
            <div ref={firstInputRef}>
              <ReceiverAutocomplete
                value={state.receiver}
                onChange={receiver => dispatch({ type: 'setReceiver', payload: receiver })}
              />
            </div>
          </div>

          {/* Danh hiệu */}
          <DanhHieuInput
            value={state.danhHieu}
            onChange={val => dispatch({ type: 'setDanhHieu', payload: val })}
            error={state.errors.danhHieu}
          />

          {/* Content — textarea placeholder (rich text in Phase 5) */}
          <div>
            <label
              htmlFor="compose-content"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 'var(--text-field-label, 22px)',
                fontWeight: 700,
                color: 'var(--color-kudos-text-on-light, #00101A)',
              }}
            >
              Nội dung <span style={{ color: 'var(--color-kudos-required-star, #CF1322)' }}>*</span>
            </label>
            <textarea
              id="compose-content"
              value={state.contentHtml}
              onChange={e => dispatch({ type: 'setContentHtml', payload: e.target.value })}
              placeholder="Viết lời cám ơn của bạn..."
              rows={5}
              style={{
                width: '100%',
                background: 'var(--color-kudos-input-bg, #FFFFFF)',
                border: '1px solid rgba(46, 57, 64, 0.3)',
                borderRadius: 'var(--radius-modal-input, 8px)',
                padding: '10px 14px',
                fontSize: 'var(--text-body, 16px)',
                color: 'var(--color-kudos-text-on-light, #00101A)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Hashtags */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 'var(--text-field-label, 22px)',
                fontWeight: 700,
                color: 'var(--color-kudos-text-on-light, #00101A)',
              }}
            >
              Hashtag <span style={{ color: 'var(--color-kudos-required-star, #CF1322)' }}>*</span>
            </label>
            <HashtagField
              hashtags={state.hashtags}
              onAdd={slug => dispatch({ type: 'addHashtag', payload: slug })}
              onRemove={slug => dispatch({ type: 'removeHashtag', payload: slug })}
            />
          </div>

          {/* Anonymous toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              fontSize: 'var(--text-body, 16px)',
              color: 'var(--color-kudos-text-on-light, #00101A)',
            }}
          >
            <input
              type="checkbox"
              checked={state.isAnonymous}
              onChange={e => dispatch({ type: 'setAnonymous', payload: e.target.checked })}
            />
            Gửi ẩn danh
          </label>
        </div>

        {state.errors.submit && (
          <p
            role="alert"
            style={{ margin: 0, color: 'var(--color-kudos-heart-active, #D4271D)', fontSize: 14 }}
          >
            {state.errors.submit}
          </p>
        )}

        <FooterActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          isValid={isValid}
          missingFields={missingFields}
        />
      </div>
    </>
  );
}

function ModalPortal({
  variant,
  initialReceiver,
}: {
  variant: 'intercepted' | 'fullpage';
  initialReceiver?: SunnerRef | null;
}) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (variant === 'intercepted') {
      router.back();
    } else {
      router.push('/kudos');
    }
  }, [variant, router]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <ComposeKudoProvider>
      <ModalInner onClose={handleClose} initialReceiver={initialReceiver} />
    </ComposeKudoProvider>,
    document.body
  );
}

export default function ComposeKudoModal({ variant, initialReceiver }: ComposeKudoModalProps) {
  return <ModalPortal variant={variant} initialReceiver={initialReceiver} />;
}
