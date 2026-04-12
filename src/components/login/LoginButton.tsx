'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signInWithGoogle } from '@/services/auth-service';

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="login-btn flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          width: '305px',
          height: '60px',
          padding: 'var(--spacing-btn-login-py) var(--spacing-btn-login-px)',
          backgroundColor: 'var(--color-btn-login-bg)',
          borderRadius: 'var(--radius-btn-login)',
          color: 'var(--color-btn-login-text)',
          fontSize: 'var(--text-btn-login-size)',
          fontWeight: 'var(--text-btn-login-weight)',
          lineHeight: 'var(--text-btn-login-line-height)',
          fontFamily: 'var(--font-montserrat)',
          outline: 'none',
          border: 'none',
          transition: 'background-color 150ms ease-in-out, box-shadow 150ms ease-in-out, transform 150ms ease-in-out',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFE07A';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-btn-login-hover)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-btn-login-bg)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        }}
        onMouseDown={(e) => {
          if (!isLoading) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFD54F';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLButtonElement).style.outline = '2px solid #FFFFFF';
          (e.currentTarget as HTMLButtonElement).style.outlineOffset = '3px';
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLButtonElement).style.outline = 'none';
        }}
      >
        <span>LOGIN With Google</span>
        {isLoading ? (
          <span
            role="status"
            aria-label="Loading"
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid var(--color-btn-login-text)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        ) : (
          <Image
            src="/assets/login/icons/google-icon.svg"
            alt="Google"
            role="img"
            width={24}
            height={24}
          />
        )}
      </button>

      {error && (
        <p
          role="alert"
          aria-live="assertive"
          style={{
            marginTop: '8px',
            fontSize: 'var(--text-error-size)',
            fontWeight: 'var(--text-error-weight)',
            lineHeight: 'var(--text-error-line-height)',
            color: 'var(--color-error)',
            maxWidth: '305px',
            fontFamily: 'var(--font-montserrat)',
          }}
        >
          {error}
        </p>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
