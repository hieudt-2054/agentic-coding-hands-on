'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Icon from '@/components/kudos/Icon';
import { fetchHashtagsClient, fetchDepartmentsClient } from '@/services/taxonomies-client';

export type DropdownKind = 'hashtag' | 'department';

interface Option {
  id: string;
  label: string;
}

interface DropdownFilterProps {
  kind: DropdownKind;
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export default function DropdownFilter({ kind, label, value, onChange }: DropdownFilterProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data = [] } = useQuery<Option[]>({
    queryKey: kind === 'hashtag' ? ['kudos-hashtags'] : ['departments'],
    queryFn: async () =>
      kind === 'hashtag'
        ? (await fetchHashtagsClient()).map(h => ({ id: h.slug, label: h.label }))
        : (await fetchDepartmentsClient()).map(d => ({ id: d.id, label: d.name })),
    staleTime: 24 * 60 * 60 * 1_000,
  });

  const selected = data.find(o => o.id === value);
  const buttonLabel = selected?.label ?? label;

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      setHighlightedIdx(0);
      return;
    }
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIdx(i => Math.min(data.length, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIdx(i => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIdx === 0) onChange(undefined);
      else {
        const option = data[highlightedIdx - 1];
        if (option) onChange(option.id);
      }
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="kudos-filter-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: 16,
          borderRadius: 'var(--radius-kudos-filter, 4px)',
          border: '1px solid var(--color-btn-secondary-border, #998C5F)',
          background: selected
            ? 'var(--color-text-gold, #FFEA9E)'
            : 'var(--color-btn-secondary-bg, rgba(255,234,158,0.10))',
          color: selected ? 'var(--color-kudos-text-on-light, #00101A)' : 'var(--color-text-primary, #FFFFFF)',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <span>{buttonLabel}</span>
        <span className="chevron" style={{ display: 'inline-flex' }}>
          <Icon name="chevron-down" size={20} />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: 220,
            maxHeight: 320,
            overflowY: 'auto',
            background: 'var(--color-kudos-panel, #00070C)',
            border: '1px solid var(--color-btn-secondary-border, #998C5F)',
            borderRadius: 12,
            boxShadow: 'var(--shadow-kudos-dropdown, 0 4px 12px rgba(0,0,0,0.25))',
            listStyle: 'none',
            margin: 0,
            padding: 4,
            zIndex: 100,
          }}
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={value === undefined}
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              style={optionStyle(highlightedIdx === 0, value === undefined)}
            >
              Tất cả
            </button>
          </li>
          {data.map((o, i) => (
            <li key={o.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === o.id}
                onClick={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
                style={optionStyle(highlightedIdx === i + 1, value === o.id)}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function optionStyle(highlighted: boolean, selected: boolean): React.CSSProperties {
  return {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: selected
      ? 'rgba(255,234,158,0.15)'
      : highlighted
      ? 'rgba(255,255,255,0.05)'
      : 'transparent',
    color: selected ? 'var(--color-text-gold, #FFEA9E)' : 'var(--color-text-primary, #FFFFFF)',
    border: 'none',
    padding: '8px 16px',
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: 8,
  };
}
