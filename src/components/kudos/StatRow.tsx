interface StatRowProps {
  label: string;
  value: number | string;
  multiplier?: boolean;
}

function formatValue(v: number | string): string {
  if (typeof v === 'string') return v;
  return v.toLocaleString('vi-VN');
}

export default function StatRow({ label, value, multiplier }: StatRowProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ gap: 8, height: 40, width: '100%' }}
    >
      <span
        style={{
          fontSize: 'var(--text-kudos-stat-label-size, 22px)',
          lineHeight: 'var(--text-kudos-stat-label-line-height, 28px)',
          fontWeight: 700,
          color: 'var(--color-text-primary, #FFFFFF)',
        }}
      >
        {label}
      </span>
      <span className="flex items-center" style={{ gap: 8 }}>
        {multiplier && (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 9999,
              background: 'var(--color-text-gold, #FFEA9E)',
              color: 'var(--color-kudos-text-on-light, #00101A)',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            x2
          </span>
        )}
        <span
          style={{
            fontSize: 'var(--text-kudos-stat-value-size, 32px)',
            lineHeight: 'var(--text-kudos-stat-value-line-height, 40px)',
            fontWeight: 700,
            color: 'var(--color-text-gold, #FFEA9E)',
            textAlign: 'right',
          }}
        >
          {formatValue(value)}
        </span>
      </span>
    </div>
  );
}
