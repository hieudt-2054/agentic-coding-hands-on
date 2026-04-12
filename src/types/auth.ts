export interface LoginState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthError {
  message: string;
  code?: string;
}
