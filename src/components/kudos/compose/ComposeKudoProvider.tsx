'use client';

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { ComposeKudoForm, KudoImageUpload } from '@/types/compose-kudo';
import type { SunnerRef } from '@/types/kudos';

interface ComposeKudoState extends ComposeKudoForm {
  receiver: SunnerRef | null;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

type Action =
  | { type: 'setReceiver'; payload: SunnerRef | null }
  | { type: 'setDanhHieu'; payload: string }
  | { type: 'setContentHtml'; payload: string }
  | { type: 'addHashtag'; payload: string }
  | { type: 'removeHashtag'; payload: string }
  | { type: 'addImage'; payload: KudoImageUpload }
  | { type: 'markImageUploaded'; payload: { tempId: string; url: string; path: string } }
  | { type: 'removeImage'; payload: string }
  | { type: 'setSubmitting'; payload: boolean }
  | { type: 'setError'; payload: { field: string; message: string } }
  | { type: 'resetForm' }
  | { type: 'markDirty' }
  | { type: 'setAnonymous'; payload: boolean };

const initialState: ComposeKudoState = {
  receiver: null,
  receiverId: '',
  danhHieu: '',
  contentHtml: '',
  hashtags: [],
  images: [],
  isAnonymous: false,
  isDirty: false,
  isSubmitting: false,
  errors: {},
};

function reducer(state: ComposeKudoState, action: Action): ComposeKudoState {
  switch (action.type) {
    case 'setReceiver':
      return {
        ...state,
        receiver: action.payload,
        receiverId: action.payload?.id ?? '',
        isDirty: true,
      };
    case 'setDanhHieu':
      return { ...state, danhHieu: action.payload, isDirty: true };
    case 'setContentHtml':
      return { ...state, contentHtml: action.payload, isDirty: true };
    case 'addHashtag':
      if (state.hashtags.includes(action.payload) || state.hashtags.length >= 5) return state;
      return { ...state, hashtags: [...state.hashtags, action.payload], isDirty: true };
    case 'removeHashtag':
      return {
        ...state,
        hashtags: state.hashtags.filter(h => h !== action.payload),
        isDirty: true,
      };
    case 'addImage':
      if (state.images.length >= 5) return state;
      return { ...state, images: [...state.images, action.payload] };
    case 'markImageUploaded':
      return {
        ...state,
        images: state.images.map(img =>
          img.tempId === action.payload.tempId
            ? { ...img, url: action.payload.url, path: action.payload.path, status: 'done', progress: 1 }
            : img
        ),
      };
    case 'removeImage':
      return {
        ...state,
        images: state.images.filter(img => img.tempId !== action.payload),
      };
    case 'setSubmitting':
      return { ...state, isSubmitting: action.payload };
    case 'setError':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.message },
      };
    case 'resetForm':
      return { ...initialState };
    case 'markDirty':
      return { ...state, isDirty: true };
    case 'setAnonymous':
      return { ...state, isAnonymous: action.payload };
    default:
      return state;
  }
}

interface ComposeKudoContextValue {
  state: ComposeKudoState;
  dispatch: Dispatch<Action>;
}

const ComposeKudoContext = createContext<ComposeKudoContextValue | null>(null);

export function ComposeKudoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ComposeKudoContext.Provider value={{ state, dispatch }}>
      {children}
    </ComposeKudoContext.Provider>
  );
}

export function useComposeKudo(): ComposeKudoContextValue {
  const ctx = useContext(ComposeKudoContext);
  if (!ctx) throw new Error('useComposeKudo must be used inside ComposeKudoProvider');
  return ctx;
}
