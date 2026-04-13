'use client';

import { useState, useEffect } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
}

function calculateTimeLeft(targetDatetime: string): CountdownResult {
  const now = new Date().getTime();
  const target = new Date(targetDatetime).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    isExpired: false,
  };
}

export function useCountdown(targetDatetime: string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>(() =>
    calculateTimeLeft(targetDatetime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDatetime));
    }, 60000);

    return () => clearInterval(interval);
  }, [targetDatetime]);

  return timeLeft;
}
