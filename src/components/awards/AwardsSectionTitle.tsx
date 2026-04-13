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

export default function AwardsSectionTitle() {
  return (
    <div style={headerStyle}>
      <p style={captionStyle}>Sun* annual awards 2025</p>
      <hr style={dividerStyle} />
      <h2 style={titleStyle}>{`H\u1ec7 th\u1ed1ng gi\u1ea3i th\u01b0\u1edfng SAA 2025`}</h2>
    </div>
  );
}
