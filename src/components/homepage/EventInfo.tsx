import type { Dictionary } from '@/i18n/dictionaries/vi';

interface EventInfoProps {
  time: string;
  venue: string;
  streamNote: string | null;
  dict: Dictionary;
}

export default function EventInfo({ time, venue, streamNote, dict }: EventInfoProps) {
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
        <span style={labelStyle}>{dict['home.eventInfo.time']}</span>
        <span style={valueStyle}>{time}</span>
      </div>
      <div className="flex items-center" style={{ gap: 8 }}>
        <span style={labelStyle}>{dict['home.eventInfo.venue']}</span>
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
