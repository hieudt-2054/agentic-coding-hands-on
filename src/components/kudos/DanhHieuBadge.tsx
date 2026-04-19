import type { DanhHieu } from '@/types/kudos';

interface DanhHieuBadgeProps {
  danhHieu: DanhHieu;
}

export default function DanhHieuBadge({ danhHieu }: DanhHieuBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 9999,
        background: 'linear-gradient(90deg, #FFEA9E 0%, #FAE287 100%)',
        color: 'var(--color-kudos-text-on-light, #00101A)',
        fontSize: 10,
        fontWeight: 700,
        lineHeight: '14px',
        whiteSpace: 'nowrap',
      }}
    >
      {danhHieu}
    </span>
  );
}
