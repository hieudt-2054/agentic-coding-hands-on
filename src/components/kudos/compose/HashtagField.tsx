'use client';

import { useState } from 'react';
import RemovableHashtagChip from './RemovableHashtagChip';
import HashtagPicker from './HashtagPicker';
import Icon from '@/components/kudos/Icon';

interface HashtagFieldProps {
  hashtags: string[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}

export default function HashtagField({ hashtags, onAdd, onRemove }: HashtagFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const canAdd = hashtags.length < 5;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {hashtags.map(slug => (
          <RemovableHashtagChip key={slug} slug={slug} onRemove={() => onRemove(slug)} />
        ))}
        {canAdd && (
          <button
            type="button"
            onClick={() => setPickerOpen(v => !v)}
            aria-expanded={pickerOpen}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 9999,
              border: '1px dashed rgba(46, 57, 64, 0.4)',
              background: 'transparent',
              color: 'var(--color-kudos-secondary-2, #2E3940)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={14} />
            Hashtag
          </button>
        )}
      </div>
      {pickerOpen && (
        <HashtagPicker
          selectedSlugs={hashtags}
          onSelect={slug => { onAdd(slug); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
