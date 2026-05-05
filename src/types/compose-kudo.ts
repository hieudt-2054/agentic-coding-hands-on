export interface ComposeKudoForm {
  receiverId: string;
  danhHieu: string;
  contentHtml: string;
  hashtags: string[];
  images: KudoImageUpload[];
  isAnonymous: boolean;
}

export interface KudoImageUpload {
  tempId: string;
  url: string | null;
  path: string | null;
  position: number;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

export interface ComposeKudoResult {
  id: string;
  createdAt: string;
}
