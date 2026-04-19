export type HoaThiLevel = 0 | 1 | 2 | 3;

export type DanhHieu = 'New Hero' | 'Rising Hero' | 'Super Hero' | 'Legend Hero';

export interface Department {
  id: string;
  name: string;
}

export interface Hashtag {
  id: string;
  slug: string;
  label: string;
}

export interface SunnerRef {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  departmentName: string | null;
  hoaThiLevel: HoaThiLevel;
  danhHieu: DanhHieu;
}

export interface KudoImage {
  url: string;
  position: number;
}

export interface KudoCard {
  id: string;
  sender: SunnerRef;
  receiver: SunnerRef;
  content: string;
  createdAt: string;
  heartsCount: number;
  likedByMe: boolean;
  hashtags: Hashtag[];
  images: KudoImage[];
  department: Department | null;
}

export type Highlight = KudoCard;

export interface KudoFilter {
  hashtag?: string;
  department?: string;
}

export interface KudosFeedPage {
  items: KudoCard[];
  nextCursor: string | null;
}

export interface SpotlightEntry {
  userId: string;
  displayName: string;
  lastKudoAt: string;
  kudosReceivedCount: number;
}

export interface SpotlightData {
  totalCount: number;
  entries: SpotlightEntry[];
}

export interface UserStats {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  secretBoxOpened: number;
  secretBoxUnopened: number;
  doubleHeartActive: boolean;
}

export interface GiftRecipient {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  giftDescription: string;
  openedAt: string;
}

export interface LiveKudoEvent {
  eventId: string;
  kudoId: string;
  receiverId: string;
  receiverName: string;
  occurredAt: string;
}

export interface HeartToggleResult {
  liked: boolean;
  count: number;
}

export interface OpenGiftResult {
  giftDescription: string;
  stats: { opened: number; unopened: number };
}
