'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { KudoImage } from '@/types/kudos';

interface ImageLightboxProps {
  images: KudoImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setIndex(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setIndex(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        // Focus trap — keep focus inside lightbox
        const el = containerRef.current;
        if (!el) return;
        const focusables = el.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [prev, next, onClose]);

  useEffect(() => {
    // Auto-focus when opened
    containerRef.current?.focus();
  }, []);

  const img = images[index];
  if (!img) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      tabIndex={-1}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10_000,
      }}
    >
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Previous image"
        style={lightboxButtonStyle('left')}
      >
        ‹
      </button>

      <div
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <Image
          src={img.url}
          alt={`Image ${index + 1} of ${images.length}`}
          width={1280}
          height={960}
          style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto', objectFit: 'contain' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -32,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#FFF',
            fontSize: 14,
          }}
        >
          {index + 1} / {images.length}
        </div>
      </div>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          next();
        }}
        aria-label="Next image"
        style={lightboxButtonStyle('right')}
      >
        ›
      </button>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        style={{ ...lightboxButtonStyle('right'), right: 16, top: 16, left: 'auto', bottom: 'auto' }}
      >
        ×
      </button>
    </div>
  );
}

function lightboxButtonStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: 16,
    width: 48,
    height: 48,
    borderRadius: 9999,
    background: 'rgba(0,0,0,0.5)',
    color: '#FFF',
    fontSize: 32,
    border: 'none',
    cursor: 'pointer',
  };
}
