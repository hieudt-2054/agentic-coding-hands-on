import Image from 'next/image';

export default function AwardsHeroKeyvisual() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 480 }}>
      <Image
        src="/assets/awards/images/awards-hero.png"
        alt="Awards Hero"
        fill
        priority
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
