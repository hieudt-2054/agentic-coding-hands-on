interface CountdownUnitProps {
  value: number;
  label: string;
}

export default function CountdownUnit({ value, label }: CountdownUnitProps) {
  const padded = String(value).padStart(2, '0');

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: 116,
        height: 128,
        gap: 14,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-digital-numbers)',
          fontSize: 'var(--text-countdown-digit-size)',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}
      >
        {padded}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
          fontSize: 'var(--text-countdown-label-size)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}
