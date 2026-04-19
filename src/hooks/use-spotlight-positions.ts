'use client';

import { useMemo } from 'react';
import type { SpotlightEntry } from '@/types/kudos';

export interface PositionedEntry extends SpotlightEntry {
  x: number; // 0..1 within container
  y: number; // 0..1 within container
  fontSize: number; // px
  opacity: number; // 0..1
}

// Deterministic PRNG — mulberry32. Identical input → identical output everywhere.
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromUserId(userId: string, kudos: number): number {
  let h = 0;
  const s = `${userId}:${kudos}`;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function useSpotlightPositions(entries: SpotlightEntry[]): PositionedEntry[] {
  return useMemo(() => {
    if (entries.length === 0) return [];
    const max = Math.max(...entries.map(e => e.kudosReceivedCount));

    return entries.map(e => {
      const rnd = mulberry32(seedFromUserId(e.userId, e.kudosReceivedCount));
      const x = 0.08 + rnd() * 0.84;
      const y = 0.12 + rnd() * 0.76;
      const weight = max === 0 ? 0 : e.kudosReceivedCount / max;
      const fontSize = 12 + Math.round(weight * 24);
      const opacity = 0.4 + weight * 0.5;
      return { ...e, x, y, fontSize, opacity };
    });
  }, [entries]);
}
