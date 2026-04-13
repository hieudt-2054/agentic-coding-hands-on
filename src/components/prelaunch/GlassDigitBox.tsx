interface GlassDigitBoxProps {
  digit: string;
}

export default function GlassDigitBox({ digit }: GlassDigitBoxProps) {
  return (
    <div
      className="prelaunch-digit-box flex items-center justify-center"
      style={{
        width: 77,
        height: 123,
        border: 'var(--border-prelaunch-digit)',
        borderRadius: 'var(--radius-prelaunch-digit)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-digital-numbers)',
          fontSize: 'var(--text-prelaunch-digit-size)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}
      >
        {digit}
      </span>
    </div>
  );
}
