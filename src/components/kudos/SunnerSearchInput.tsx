'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/kudos/Icon';
import { useTranslation } from '@/i18n/use-translation';

interface SunnerSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}

export default function SunnerSearchInput({ value, onChange, size = 'md' }: SunnerSearchInputProps) {
  const { t } = useTranslation();
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const handle = setTimeout(() => onChange(local), 200);
    return () => clearTimeout(handle);
  }, [local, onChange]);

  const width = size === 'sm' ? 219 : 320;
  const height = size === 'sm' ? 39 : 48;

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        width,
        maxWidth: '100%',
        height,
        padding: '4px 12px',
        borderRadius: 'var(--radius-kudos-pill-sm, 46.404px)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
        background: 'var(--color-btn-secondary-bg, rgba(255,234,158,0.10))',
        color: 'var(--color-text-primary, #FFFFFF)',
      }}
    >
      <Icon name="search" size={16} />
      <input
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value.slice(0, 100))}
        maxLength={100}
        placeholder={t('kudos.spotlight.search')}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'inherit',
          fontSize: 14,
        }}
      />
    </label>
  );
}
