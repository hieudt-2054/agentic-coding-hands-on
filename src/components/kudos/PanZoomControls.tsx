'use client';

import Icon from '@/components/kudos/Icon';

interface PanZoomControlsProps {
  mode: 'pan' | 'zoom';
  onToggle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

function controlBtnStyle(active?: boolean): React.CSSProperties {
  return {
    width: 36,
    height: 36,
    borderRadius: 9999,
    border: '1px solid var(--color-btn-secondary-border, #998C5F)',
    background: active
      ? 'var(--color-text-gold, #FFEA9E)'
      : 'var(--color-btn-secondary-bg, rgba(255,234,158,0.10))',
    color: active ? 'var(--color-kudos-text-on-light, #00101A)' : 'var(--color-text-primary, #FFFFFF)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  };
}

export default function PanZoomControls({ mode, onToggle, onZoomIn, onZoomOut, onReset }: PanZoomControlsProps) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 6, position: 'absolute', top: 16, right: 16, zIndex: 2 }}
    >
      <button
        type="button"
        onClick={onZoomOut}
        aria-label="Zoom out"
        style={controlBtnStyle()}
      >
        −
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        aria-label="Zoom in"
        style={controlBtnStyle()}
      >
        +
      </button>
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset view"
        style={controlBtnStyle()}
      >
        ⤢
      </button>
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle pan/zoom"
        title="Pan/Zoom"
        style={controlBtnStyle(mode === 'pan')}
      >
        <Icon name="pan-zoom" size={18} />
      </button>
    </div>
  );
}
