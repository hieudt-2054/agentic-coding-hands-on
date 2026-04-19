'use client';

import Image from 'next/image';
import Link from 'next/link';
import HoaThiBadge from '@/components/kudos/HoaThiBadge';
import DanhHieuBadge from '@/components/kudos/DanhHieuBadge';
import type { SunnerRef } from '@/types/kudos';

interface ProfilePreviewProps {
  sunner: SunnerRef;
}

export default function ProfilePreview({ sunner }: ProfilePreviewProps) {
  return (
    <div
      role="tooltip"
      className="flex flex-col"
      style={{
        gap: 12,
        minWidth: 240,
        maxWidth: 280,
        padding: 16,
        borderRadius: 12,
        background: 'var(--color-kudos-panel, #00070C)',
        border: '1px solid var(--color-btn-secondary-border, #998C5F)',
        boxShadow: 'var(--shadow-kudos-modal, 0 16px 40px rgba(0,0,0,0.5))',
        color: 'var(--color-text-primary, #FFFFFF)',
      }}
    >
      <div className="flex items-center" style={{ gap: 12 }}>
        <Image
          src={sunner.avatarUrl ?? '/assets/kudos/images/avatar-placeholder.svg'}
          alt=""
          width={48}
          height={48}
          style={{ borderRadius: 9999, objectFit: 'cover' }}
        />
        <div className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
          <Link
            href={`/users/${sunner.id}`}
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-text-primary, #FFFFFF)',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {sunner.displayName}
          </Link>
          {sunner.departmentName && (
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary, #DBD1C1)' }}>
              {sunner.departmentName}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <HoaThiBadge level={sunner.hoaThiLevel} />
        <DanhHieuBadge danhHieu={sunner.danhHieu} />
      </div>
    </div>
  );
}
