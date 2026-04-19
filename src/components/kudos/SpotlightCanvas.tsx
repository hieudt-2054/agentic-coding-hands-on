'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchKudosSpotlightClient } from '@/services/spotlight-client';
import { useSpotlightPositions } from '@/hooks/use-spotlight-positions';
import SunnerSearchInput from '@/components/kudos/SunnerSearchInput';
import PanZoomControls from '@/components/kudos/PanZoomControls';
import SpotlightSkeleton from '@/components/kudos/skeletons/SpotlightSkeleton';
import LiveTicker from '@/components/kudos/LiveTicker';
import { useTranslation } from '@/i18n/use-translation';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.5;

export default function SpotlightCanvas() {
  const { t } = useTranslation();
  const { data, isPending, isError } = useQuery({
    queryKey: ['kudos-spotlight'],
    queryFn: fetchKudosSpotlightClient,
    staleTime: 60_000,
  });

  const positioned = useSpotlightPositions(data?.entries ?? []);

  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'pan' | 'zoom'>('pan');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== 'pan') return;
      dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pan.x, origY: pan.y };
    },
    [mode, pan]
  );
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setPan({ x: d.origX + (e.clientX - d.startX), y: d.origY + (e.clientY - d.startY) });
  }, []);
  const onMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (mode !== 'zoom') return;
      e.preventDefault();
      setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + (e.deltaY < 0 ? 0.1 : -0.1))));
    },
    [mode]
  );

  const toggleMode = () => setMode(m => (m === 'pan' ? 'zoom' : 'pan'));
  const zoomIn = () => setZoom(z => Math.min(MAX_ZOOM, z + 0.1));
  const zoomOut = () => setZoom(z => Math.max(MIN_ZOOM, z - 0.1));
  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  if (isPending) return <SpotlightSkeleton />;
  if (isError || !data) {
    return (
      <div
        role="alert"
        style={{
          padding: 48,
          textAlign: 'center',
          color: 'var(--color-text-secondary, #DBD1C1)',
        }}
      >
        Không tải được Spotlight.
      </div>
    );
  }

  const q = query.trim().toLowerCase();

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1157,
        height: 548,
        margin: '0 auto',
        position: 'relative',
        borderRadius: 'var(--radius-kudos-canvas, 47.14px)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
        background: 'var(--color-kudos-page, #00101A)',
        overflow: 'hidden',
        cursor: mode === 'pan' ? 'grab' : 'zoom-in',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      <Image
        src="/assets/kudos/images/spotlight-aurora.svg"
        alt=""
        fill
        aria-hidden="true"
        style={{ objectFit: 'cover', opacity: 0.5, pointerEvents: 'none' }}
      />

      <div
        className="flex items-center"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 160,
          zIndex: 2,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-kudos-counter-size, 36px)',
            lineHeight: 'var(--text-kudos-counter-line-height, 44px)',
            fontWeight: 700,
            color: 'var(--color-text-primary, #FFFFFF)',
          }}
        >
          {data.totalCount} {t('kudos.spotlight.counterSuffix')}
        </div>
        <SunnerSearchInput value={query} onChange={setQuery} size="sm" />
      </div>

      <PanZoomControls
        mode={mode}
        onToggle={toggleMode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center',
          transition: dragRef.current ? 'none' : 'transform 180ms ease-out',
        }}
      >
        {positioned.map(p => {
          const matches = q.length === 0 || p.displayName.toLowerCase().includes(q);
          return (
            <Link
              key={p.userId}
              href={`/users/${p.userId}`}
              title={`${p.displayName} · ${new Date(p.lastKudoAt).toLocaleString()}`}
              style={{
                position: 'absolute',
                left: `${p.x * 100}%`,
                top: `${p.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                color: 'var(--color-text-gold, #FFEA9E)',
                fontSize: p.fontSize,
                fontWeight: 700,
                opacity: matches ? p.opacity : 0.15,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 150ms ease-in-out',
                pointerEvents: 'auto',
              }}
            >
              {p.displayName}
            </Link>
          );
        })}
      </div>

      <LiveTicker variant="overlay" />
    </div>
  );
}
