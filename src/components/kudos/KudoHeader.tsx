'use client';

import Link from 'next/link';
import Image from 'next/image';
import HoaThiBadge from '@/components/kudos/HoaThiBadge';
import DanhHieuBadge from '@/components/kudos/DanhHieuBadge';
import Icon from '@/components/kudos/Icon';
import HoverPreview from '@/components/kudos/HoverPreview';
import ProfilePreview from '@/components/kudos/ProfilePreview';
import type { SunnerRef } from '@/types/kudos';

interface KudoHeaderProps {
  sender: SunnerRef;
  receiver: SunnerRef;
  variant?: 'highlight' | 'feed';
}

function SunnerChip({ sunner, align }: { sunner: SunnerRef; align: 'start' | 'end' }) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 12, flexDirection: align === 'start' ? 'row' : 'row-reverse', flex: 1, minWidth: 0 }}
    >
      <HoverPreview content={<ProfilePreview sunner={sunner} />}>
        <Link
          href={`/users/${sunner.id}`}
          aria-label={sunner.displayName}
          style={{
            display: 'block',
            width: 56,
            height: 56,
            borderRadius: 9999,
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid transparent',
            transition: 'border-color 150ms ease-in-out',
          }}
          className="kudos-avatar"
        >
          <Image
            src={sunner.avatarUrl ?? '/assets/kudos/images/avatar-placeholder.svg'}
            alt=""
            width={56}
            height={56}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Link>
      </HoverPreview>
      <div
        className="flex flex-col"
        style={{
          gap: 4,
          textAlign: align === 'start' ? 'left' : 'right',
          minWidth: 0,
        }}
      >
        <Link
          href={`/users/${sunner.id}`}
          style={{
            fontSize: 'var(--text-kudos-card-name-size, 20px)',
            lineHeight: 'var(--text-kudos-card-name-line-height, 28px)',
            fontWeight: 700,
            color: 'var(--color-kudos-text-on-light, #00101A)',
            textDecoration: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sunner.displayName}
        </Link>
        <div
          className="flex items-center"
          style={{
            gap: 8,
            fontSize: 14,
            color: 'var(--color-kudos-secondary-2, #2E3940)',
            justifyContent: align === 'start' ? 'flex-start' : 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {sunner.departmentName && <span>{sunner.departmentName}</span>}
          <HoaThiBadge level={sunner.hoaThiLevel} />
          <DanhHieuBadge danhHieu={sunner.danhHieu} />
        </div>
      </div>
    </div>
  );
}

export default function KudoHeader({ sender, receiver }: KudoHeaderProps) {
  return (
    <div className="flex items-center" style={{ gap: 16, width: '100%' }}>
      <SunnerChip sunner={sender} align="start" />
      <div
        aria-hidden="true"
        style={{ flexShrink: 0, color: 'var(--color-btn-secondary-border, #998C5F)' }}
      >
        <Icon name="send" size={24} />
      </div>
      <SunnerChip sunner={receiver} align="end" />
    </div>
  );
}
