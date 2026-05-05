'use client';

interface ModalBackdropProps {
  onClose: () => void;
}

export default function ModalBackdrop({ onClose }: ModalBackdropProps) {
  return (
    <div
      aria-hidden="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-kudos-modal-backdrop, rgba(0, 16, 26, 0.80))',
        zIndex: 1000,
      }}
    />
  );
}
