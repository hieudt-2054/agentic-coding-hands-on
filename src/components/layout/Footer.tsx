export default function Footer() {
  return (
    <footer
      className="flex items-center justify-center"
      style={{
        width: '100%',
        padding: 'var(--spacing-footer-py) var(--spacing-footer-px)',
        borderTop: 'var(--border-footer-top)',
      }}
    >
      <p
        style={{
          fontSize: 'var(--text-footer-size)',
          fontWeight: 'var(--text-footer-weight)',
          lineHeight: 'var(--text-footer-line-height)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-montserrat-alt)',
          textAlign: 'center',
        }}
      >
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
