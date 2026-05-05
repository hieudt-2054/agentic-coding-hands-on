'use client';

export default function ModalTitle() {
  return (
    <h2
      style={{
        fontSize: 'var(--text-modal-title, 32px)',
        lineHeight: 'var(--text-modal-title-line-height, 40px)',
        fontWeight: 700,
        color: 'var(--color-kudos-text-on-light, #00101A)',
        textAlign: 'center',
        margin: 0,
      }}
    >
      Gửi lời cám ơn và ghi nhận đến đồng đội
    </h2>
  );
}
