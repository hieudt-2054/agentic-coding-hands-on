'use client';

import CharCounter from './CharCounter';

interface DanhHieuInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

const MAX_LENGTH = 60;
const COUNTER_THRESHOLD = 50;

export default function DanhHieuInput({ value, onChange, error }: DanhHieuInputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          htmlFor="danh-hieu-input"
          style={{
            fontSize: 'var(--text-field-label, 22px)',
            lineHeight: 'var(--text-field-label-line-height, 28px)',
            fontWeight: 700,
            color: 'var(--color-kudos-text-on-light, #00101A)',
          }}
        >
          Danh hiệu <span style={{ color: 'var(--color-kudos-required-star, #CF1322)' }}>*</span>
        </label>
        <CharCounter value={value.length} max={MAX_LENGTH} threshold={COUNTER_THRESHOLD} />
      </div>
      <input
        id="danh-hieu-input"
        type="text"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={e => onChange(e.target.value)}
        placeholder="Nhập danh hiệu..."
        style={{
          width: '100%',
          background: 'var(--color-kudos-input-bg, #FFFFFF)',
          border: error
            ? '1px solid var(--color-kudos-heart-active, #D4271D)'
            : '1px solid rgba(46, 57, 64, 0.3)',
          borderRadius: 'var(--radius-modal-input, 8px)',
          padding: '10px 14px',
          fontSize: 'var(--text-body, 16px)',
          color: 'var(--color-kudos-text-on-light, #00101A)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-body-sm, 14px)',
          color: 'var(--color-kudos-secondary-2, #2E3940)',
        }}
      >
        Ví dụ: &quot;Ngôi sao hỗ trợ&quot;, &quot;Người hùng thầm lặng&quot;
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-body-sm, 14px)',
          color: 'var(--color-kudos-secondary-2, #2E3940)',
        }}
      >
        Danh hiệu sẽ hiển thị trên thẻ kudo.
      </p>
      {error && (
        <p
          role="alert"
          style={{ margin: 0, fontSize: 13, color: 'var(--color-kudos-heart-active, #D4271D)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
