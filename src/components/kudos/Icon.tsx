import Image from 'next/image';

export type KudosIconName =
  | 'pen'
  | 'search'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'send'
  | 'heart'
  | 'link'
  | 'open-gift'
  | 'pan-zoom'
  | 'star';

interface IconProps {
  name: KudosIconName;
  size?: number;
  alt?: string;
  className?: string;
}

export default function Icon({ name, size = 24, alt = '', className }: IconProps) {
  return (
    <Image
      src={`/assets/kudos/icons/${name}.svg`}
      width={size}
      height={size}
      alt={alt}
      className={className}
      aria-hidden={alt === '' ? true : undefined}
    />
  );
}
