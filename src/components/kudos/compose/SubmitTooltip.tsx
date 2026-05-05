'use client';

import { useState, useRef } from 'react';
import type { ReactNode } from 'react';

interface SubmitTooltipProps {
  missingFields: string[];
  children: ReactNode;
}

export default function SubmitTooltip({ missingFields, children }: SubmitTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (missingFields.length === 0) return <>{children}</>;

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
  };

  const hide = () => {
    timerRef.current = setTimeout(() => setVisible(false), 150);
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: 8,
            background: '#00101A',
            color: '#FFFFFF',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            zIndex: 1300,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Vui lòng điền đủ thông tin:</p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {missingFields.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
