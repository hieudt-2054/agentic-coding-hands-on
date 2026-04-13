interface AwardMetaRowProps {
  label: string;
  value: string;
}

const labelStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 400,
  color: 'var(--color-text-primary)',
  margin: 0,
};

const valueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--color-text-gold)',
  margin: 0,
};

export default function AwardMetaRow({ label, value }: AwardMetaRowProps) {
  return (
    <div className="flex flex-row items-center" style={{ gap: 'var(--spacing-meta-gap)' }}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}
