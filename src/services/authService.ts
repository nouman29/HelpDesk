import { apiRequest } from './apiClient';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  // Use a relative URL so the request goes through the Vite dev proxy
  // (see vite.config.ts → server.proxy['/register']). This avoids CORS
  // in dev without requiring backend changes.
  return apiRequest<AuthResponse>('/register', {
    method: 'POST',
    body: payload,
    baseUrl: '',
  });
}

export function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/signin', { method: 'POST', body: payload });
}
