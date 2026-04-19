'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface HoverPreviewProps {
  content: ReactNode;
  children: ReactNode;
  delayMs?: number;
}

export default function HoverPreview({ content, children, delayMs = 500 }: HoverPreviewProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = () => {
    timerRef.current = setTimeout(() => setOpen(true), delayMs);
  };
  const cancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setOpen(false);
  };

  useEffect(() => () => cancel(), []);

  return (
    <span
      onMouseEnter={schedule}
      onMouseLeave={cancel}
      onFocus={schedule}
      onBlur={cancel}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {children}
      {open && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            zIndex: 50,
            pointerEvents: 'auto',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
