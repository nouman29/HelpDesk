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
  return apiRequest<AuthResponse>('/register', { method: 'POST', body: payload });
}

export function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/signin', { method: 'POST', body: payload });
}
