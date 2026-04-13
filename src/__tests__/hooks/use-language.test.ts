import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '@/hooks/use-language';

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns "vi" as default language when localStorage is empty', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('vi');
  });

  it('reads language from localStorage on init', () => {
    localStorage.setItem('lang', 'en');
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('en');
  });

  it('setLanguage writes to localStorage', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.setLanguage('en');
    });
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('setLanguage updates state', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.setLanguage('en');
    });
    expect(result.current.language).toBe('en');
  });
});
