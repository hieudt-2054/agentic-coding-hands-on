import type { Award } from '@/types/homepage';
import AwardCard from '@/components/homepage/AwardCard';

interface AwardsSectionProps {
  awards: Award[];
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const captionStyle: React.CSSProperties = {
  fontSize: 'var(--text-section-caption-size)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  margin: 0,
};

const dividerStyle: React.CSSProperties = {
  borderTop: 'var(--border-section-divider)',
  width: '100%',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--text-section-title-size)',
  fontWeight: 'var(--text-section-title-weight)' as unknown as number,
  lineHeight: 'var(--text-section-title-line-height)',
  color: 'var(--color-text-gold)',
  letterSpacing: '-0.25px',
  margin: 0,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--spacing-awards-grid-gap)',
};

const emptyStyle: React.CSSProperties = {
  minHeight: 200,
};

export default function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section className="flex flex-col" style={{ gap: 'var(--spacing-awards-grid-gap)' }}>
      {/* C1 Header */}
      <div style={headerStyle}>
        <p style={captionStyle}>Sun* annual awards 2025</p>
        <hr style={dividerStyle} />
        <h2 style={titleStyle}>Hệ thống giải thưởng</h2>
      </div>

      {/* C2 Grid */}
      {awards.length > 0 ? (
        <div className="awards-grid" style={gridStyle}>
          {awards.map((award, index) => (
            <AwardCard
              key={award.id}
              award={award}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div style={emptyStyle} data-testid="awards-empty" />
      )}
    </section>
  );
}
