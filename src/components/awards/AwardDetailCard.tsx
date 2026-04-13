import Image from 'next/image';
import type { AwardFull } from '@/types/awards';
import type { Dictionary } from '@/i18n/dictionaries/vi';
import AwardMetaRow from '@/components/awards/AwardMetaRow';

interface AwardDetailCardProps {
  award: AwardFull;
  dict: Dictionary;
}

const containerStyle: React.CSSProperties = {
  gap: 'var(--spacing-card-inner-gap)',
  scrollMarginTop: 96,
};

const imageStyle: React.CSSProperties = {
  borderRadius: 'var(--radius-award-img)',
  border: 'var(--border-award-img)',
  boxShadow: 'var(--shadow-card-glow)',
  mixBlendMode: 'screen',
  flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--color-text-gold)',
  margin: 0,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 400,
  color: 'var(--color-text-primary)',
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  gap: 16,
  flex: 1,
};

export default function AwardDetailCard({ award, dict }: AwardDetailCardProps) {
  return (
    <div
      id={award.slug}
      className="award-detail-card flex flex-row"
      style={containerStyle}
    >
      <Image
        src={award.imageUrl}
        alt={award.title}
        width={336}
        height={336}
        className="award-detail-image"
        style={imageStyle}
        loading="lazy"
      />
      <div className="flex flex-col" style={contentStyle}>
        <h3 style={titleStyle}>{award.title}</h3>
        <p style={descriptionStyle}>{award.description}</p>
        <AwardMetaRow
          label={dict['awards.quantity']}
          value={`${String(award.quantity).padStart(2, '0')} ${award.unitType}`}
        />
        <AwardMetaRow
          label={dict['awards.prizeValue']}
          value={award.prizeValue}
        />
      </div>
    </div>
  );
}
