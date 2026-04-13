import Link from 'next/link';
import Image from 'next/image';
import type { Award } from '@/types/homepage';

interface AwardCardProps {
  award: Award;
  priority?: boolean;
}

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-award-card-gap)',
  width: 336,
  textDecoration: 'none',
  transition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
};

const imageStyle: React.CSSProperties = {
  borderRadius: 'var(--radius-award-img)',
  border: 'var(--border-award-img)',
  boxShadow: 'var(--shadow-card-glow)',
  mixBlendMode: 'screen',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--text-card-title-size)',
  fontWeight: 400,
  color: 'var(--color-text-gold)',
  margin: 0,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 'var(--text-card-desc-size)',
  fontWeight: 400,
  color: 'var(--color-text-primary)',
  letterSpacing: '0.5px',
  margin: 0,
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
};

const detailStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  padding: '16px 0',
};

export default function AwardCard({ award, priority }: AwardCardProps) {
  return (
    <Link href={`#${award.slug}`} className="award-card" style={cardStyle}>
      <Image
        src={award.imageUrl}
        alt={award.title}
        width={336}
        height={336}
        style={imageStyle}
        {...(priority ? { priority: true } : {})}
      />
      <div className="flex flex-col">
        <p style={titleStyle}>{award.title}</p>
        <p style={descriptionStyle}>{award.description}</p>
        <span style={detailStyle}>Chi tiết →</span>
      </div>
    </Link>
  );
}
