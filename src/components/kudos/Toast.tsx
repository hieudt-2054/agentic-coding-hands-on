import type { ToastKind } from '@/providers/ToastProvider';

interface ToastProps {
  kind: ToastKind;
  message: string;
}

const BORDER_COLOR: Record<ToastKind, string> = {
  success: '#FFEA9E',
  error: '#FF4D4F',
  info: '#DBD1C1',
};

export default function Toast({ kind, message }: ToastProps) {
  return (
    <div
      role="status"
      style={{
        minWidth: 240,
        maxWidth: 360,
        padding: '12px 16px',
        borderRadius: 8,
        backgroundColor: 'var(--color-kudos-panel, #00070C)',
        border: `1px solid ${BORDER_COLOR[kind]}`,
        color: 'var(--color-text-primary, #FFFFFF)',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      }}
    >
      {message}
    </div>
  );
}
