import { renderHook, act } from '@testing-library/react';
import { useCountdown } from '@/hooks/use-countdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns correct days/hours/minutes for a future target date', () => {
    // Set "now" to a known time
    jest.setSystemTime(new Date('2026-04-10T10:00:00Z'));

    // Target is 2 days, 3 hours, 30 minutes in the future
    const target = '2026-04-12T13:30:00Z';
    const { result } = renderHook(() => useCountdown(target));

    expect(result.current.days).toBe(2);
    expect(result.current.hours).toBe(3);
    expect(result.current.minutes).toBe(30);
    expect(result.current.isExpired).toBe(false);
  });

  it('returns isExpired: true and all zeros when target is in the past', () => {
    jest.setSystemTime(new Date('2026-04-15T10:00:00Z'));

    const target = '2026-04-10T10:00:00Z';
    const { result } = renderHook(() => useCountdown(target));

    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.isExpired).toBe(true);
  });

  it('updates values after interval tick', () => {
    jest.setSystemTime(new Date('2026-04-10T10:00:00Z'));

    const target = '2026-04-12T13:30:00Z';
    const { result } = renderHook(() => useCountdown(target));

    // Initial: 2d 3h 30m
    expect(result.current.days).toBe(2);
    expect(result.current.hours).toBe(3);
    expect(result.current.minutes).toBe(30);

    // Advance 60 minutes (60000ms * 60)
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    // After 1 minute: 2d 3h 29m
    expect(result.current.days).toBe(2);
    expect(result.current.hours).toBe(3);
    expect(result.current.minutes).toBe(29);
  });

  it('cleans up setInterval on unmount', () => {
    jest.setSystemTime(new Date('2026-04-10T10:00:00Z'));

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const target = '2026-04-12T13:30:00Z';
    const { unmount } = renderHook(() => useCountdown(target));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
