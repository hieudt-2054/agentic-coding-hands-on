import type { Award } from '@/types/homepage';

export interface AwardFull extends Award {
  quantity: number;
  unitType: string;
  prizeValue: string;
}
