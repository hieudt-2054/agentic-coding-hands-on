'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Hashtag } from '@/types/kudos';

interface HashtagPickerProps {
  onSelect: (slug: string) => void;
  onClose: () => void;
  selectedSlugs: string[];
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,29}$/;

async function fetchHashtags(): Promise<Hashtag[]> {
  const res = await fetch('/api/kudos/hashtags');
  if (!res.ok) return [];
  return res.json() as Promise<Hashtag[]>;
}

export default function HashtagPicker({ onSelect, onClose, selectedSlugs }: HashtagPickerProps) {
  const [customSlug, setCustomSlug] = useState('');
  const [customError, setCustomError] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const { data: hashtags = [] } = useQuery<Hashtag[], Error>({
    queryKey: ['hashtags'],
    queryFn: fetchHashtags,
    staleTime: 60_000,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCustomSubmit = () => {
    if (!SLUG_REGEX.test(customSlug)) {
      setCustomError('Slug không hợp lệ (chỉ a-z, 0-9, dấu -)');
      return;
    }
    onSelect(customSlug);
    onClose();
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Chọn hashtag"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 1200,
        background: '#FFFFFF',
        borderRadius: 12,
        boxShadow: 'var(--shadow-kudos-dropdown, 0 4px 12px rgba(0,0,0,0.25))',
        padding: 16,
        minWidth: 260,
        maxWidth: 320,
        marginTop: 4,
      }}
    >
      <p
        style={{
          margin: '0 0 10px',
          fontWeight: 600,
          fontSize: 14,
          color: 'var(--color-kudos-secondary-2, #2E3940)',
        }}
      >
        Chọn hashtag
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {hashtags.map(h => {
          const isSelected = selectedSlugs.includes(h.slug);
          return (
            <button
              key={h.id}
              type="button"
              disabled={isSelected}
              onClick={() => { onSelect(h.slug); onClose(); }}
              style={{
                padding: '4px 12px',
                borderRadius: 9999,
                border: '1px solid rgba(46,57,64,0.3)',
                background: isSelected ? 'rgba(255, 234, 158, 0.40)' : 'transparent',
                color: 'var(--color-kudos-text-on-light, #00101A)',
                fontSize: 13,
                cursor: isSelected ? 'default' : 'pointer',
                opacity: isSelected ? 0.6 : 1,
              }}
            >
              #{h.label}
            </button>
          );
        })}
      </div>
      <div style={{ borderTop: '1px solid rgba(46,57,64,0.1)', paddingTop: 10 }}>
        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--color-kudos-secondary-2, #2E3940)' }}>
          Hoặc nhập slug mới
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            value={customSlug}
            onChange={e => { setCustomSlug(e.target.value.toLowerCase()); setCustomError(''); }}
            placeholder="vd: team-work"
            style={{
              flex: 1,
              border: '1px solid rgba(46,57,64,0.3)',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleCustomSubmit}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--color-btn-primary-bg, #FFEA9E)',
              color: 'var(--color-btn-primary-text, #00101A)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Thêm
          </button>
        </div>
        {customError && (
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-kudos-heart-active, #D4271D)' }}>
            {customError}
          </p>
        )}
      </div>
    </div>
  );
}
