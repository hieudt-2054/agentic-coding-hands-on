'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageLightbox from '@/components/kudos/ImageLightbox';
import { useTranslation } from '@/i18n/use-translation';
import type { KudoImage } from '@/types/kudos';

interface ImageGalleryProps {
  images: KudoImage[];
}

const MAX_VISIBLE = 5;

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  const visible = images.slice(0, MAX_VISIBLE);
  if (visible.length === 0) return null;

  const total = visible.length;

  return (
    <>
      <div className="flex" style={{ gap: 8, flexWrap: 'wrap' }}>
        {visible.map((img, i) => (
          <button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={t('kudos.image.ariaLabel')
              .replace('{i}', String(i + 1))
              .replace('{total}', String(total))}
            style={{
              width: 112,
              height: 112,
              borderRadius: 12,
              overflow: 'hidden',
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            className="kudos-image-thumb"
          >
            <Image
              src={img.url}
              alt=""
              width={112}
              height={112}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <ImageLightbox
          images={visible}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
