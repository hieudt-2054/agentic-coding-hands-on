export interface Award {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export interface KudosInfo {
  label: string;
  title: string;
  description: string;
  detailUrl: string | null;
  decorationImageUrl: string | null;
}

export interface EventConfig {
  targetDatetime: string;
  time: string;
  venue: string;
  streamNote: string | null;
}
