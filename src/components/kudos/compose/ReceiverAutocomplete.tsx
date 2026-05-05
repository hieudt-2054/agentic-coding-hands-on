'use client';

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from 'react';
import Image from 'next/image';
import { useReceiverSearch } from '@/hooks/use-receiver-search';
import type { SunnerRef } from '@/types/kudos';

interface ReceiverAutocompleteProps {
  value: SunnerRef | null;
  onChange: (v: SunnerRef | null) => void;
}

export default function ReceiverAutocomplete({ value, onChange }: ReceiverAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data: results = [], isFetching } = useReceiverSearch(query);

  const select = useCallback(
    (sunner: SunnerRef) => {
      onChange(sunner);
      setQuery('');
      setOpen(false);
      setActiveIndex(-1);
    },
    [onChange]
  );

  const clear = useCallback(() => {
    onChange(null);
    setQuery('');
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      select(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (results.length > 0 && query) setOpen(true);
    else setOpen(false);
    setActiveIndex(-1);
  }, [results, query]);

  if (value) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--color-kudos-input-bg, #FFFFFF)',
          borderRadius: 'var(--radius-modal-input, 8px)',
          padding: '10px 14px',
          border: '1px solid rgba(46, 57, 64, 0.3)',
        }}
      >
        <Image
          src={value.avatarUrl ?? '/assets/kudos/images/avatar-placeholder.svg'}
          alt=""
          width={32}
          height={32}
          style={{ borderRadius: 9999, objectFit: 'cover' }}
        />
        <span style={{ fontWeight: 600, flex: 1, color: 'var(--color-kudos-text-on-light, #00101A)' }}>
          {value.displayName}
        </span>
        <button
          type="button"
          onClick={clear}
          aria-label="Xóa người nhận"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-kudos-heart-active, #D4271D)',
            fontSize: 18,
            lineHeight: 1,
            padding: '0 2px',
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm tên đồng đội..."
        autoComplete="off"
        style={{
          width: '100%',
          background: 'var(--color-kudos-input-bg, #FFFFFF)',
          border: '1px solid rgba(46, 57, 64, 0.3)',
          borderRadius: 'var(--radius-modal-input, 8px)',
          padding: '10px 14px',
          fontSize: 'var(--text-body, 16px)',
          color: 'var(--color-kudos-text-on-light, #00101A)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {isFetching && (
        <span
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 12,
            color: 'var(--color-kudos-muted, #999999)',
          }}
        >
          ...
        </span>
      )}
      {open && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            border: '1px solid rgba(46, 57, 64, 0.2)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-kudos-dropdown, 0 4px 12px rgba(0,0,0,0.25))',
            zIndex: 1100,
            maxHeight: 240,
            overflowY: 'auto',
            padding: 0,
            margin: '4px 0 0',
            listStyle: 'none',
          }}
        >
          {results.map((sunner, idx) => (
            <li
              key={sunner.id}
              role="option"
              aria-selected={idx === activeIndex}
              onClick={() => select(sunner)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                cursor: 'pointer',
                background: idx === activeIndex ? 'rgba(255, 234, 158, 0.15)' : 'transparent',
                color: 'var(--color-kudos-text-on-light, #00101A)',
              }}
            >
              <Image
                src={sunner.avatarUrl ?? '/assets/kudos/images/avatar-placeholder.svg'}
                alt=""
                width={28}
                height={28}
                style={{ borderRadius: 9999, objectFit: 'cover', flexShrink: 0 }}
              />
              <span style={{ fontWeight: 500 }}>{sunner.displayName}</span>
              {sunner.departmentName && (
                <span style={{ fontSize: 13, color: 'var(--color-kudos-muted, #999999)', marginLeft: 4 }}>
                  {sunner.departmentName}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
