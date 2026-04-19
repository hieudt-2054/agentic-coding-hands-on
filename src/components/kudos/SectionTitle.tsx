interface SectionTitleProps {
  caption: string;
  title: string;
  children?: React.ReactNode;
}

export default function SectionTitle({ caption, title, children }: SectionTitleProps) {
  return (
    <header
      className="kudos-section-header"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-section-caption-size, 24px)',
          fontWeight: 700,
          color: 'var(--color-text-primary, #FFFFFF)',
        }}
      >
        {caption}
      </div>
      <div
        className="flex items-end justify-between"
        style={{ gap: 24, flexWrap: 'wrap' }}
      >
        <h2
          style={{
            fontSize: 'var(--text-kudos-hero-size, 57px)',
            lineHeight: 'var(--text-kudos-hero-line-height, 64px)',
            letterSpacing: 'var(--text-kudos-hero-letter-spacing, -0.25px)',
            fontWeight: 700,
            color: 'var(--color-text-gold, #FFEA9E)',
            margin: 0,
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </header>
  );
}
