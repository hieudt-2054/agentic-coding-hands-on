import Image from 'next/image';

const sectionStyle: React.CSSProperties = {
  maxWidth: 1152,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
};

export default function RootFurtherSection() {
  return (
    <section style={sectionStyle}>
      <Image
        src="/assets/homepage/images/root-further-content.png"
        alt="Root Further - Giải thích tinh thần chương trình Sun Annual Awards 2025"
        width={1153}
        height={1084}
        style={{ width: '100%', height: 'auto' }}
      />
    </section>
  );
}
