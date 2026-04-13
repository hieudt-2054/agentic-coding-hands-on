import type { Dictionary } from '@/i18n/dictionaries/vi';

interface AwardsSectionTitleProps {
  dict: Dictionary;
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const captionStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  margin: 0,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid #2E3940',
  width: '100%',
};

const titleStyle: React.CSSProperties = {
  fontSize: 57,
  fontWeight: 700,
  lineHeight: '64px',
  color: 'var(--color-text-gold)',
  letterSpacing: '-0.25px',
  margin: 0,
};

export default function AwardsSectionTitle({ dict }: AwardsSectionTitleProps) {
  return (
    <div style={headerStyle}>
      <p style={captionStyle}>{dict['awards.caption']}</p>
      <hr style={dividerStyle} />
      <h2 style={titleStyle}>{dict['awards.title']}</h2>
    </div>
  );
}
