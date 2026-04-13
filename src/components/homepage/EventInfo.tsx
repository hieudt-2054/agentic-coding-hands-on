interface EventInfoProps {
  time: string;
  venue: string;
  streamNote: string | null;
}

export default function EventInfo({ time, venue, streamNote }: EventInfoProps) {
  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-event-label-size)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--text-event-value-size)',
    fontWeight: 700,
    color: 'var(--color-text-gold)',
  };

  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <span style={labelStyle}>Thời gian:</span>
        <span style={valueStyle}>{time}</span>
      </div>
      <div className="flex items-center" style={{ gap: 8 }}>
        <span style={labelStyle}>Địa điểm:</span>
        <span style={valueStyle}>{venue}</span>
      </div>
      {streamNote && (
        <span
          style={{
            fontSize: 'var(--text-event-label-size)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '0.5px',
          }}
        >
          {streamNote}
        </span>
      )}
    </div>
  );
}
