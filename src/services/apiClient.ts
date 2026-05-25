export const API_BASE_URL: string =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000';

export interface ApiEnvelope<T> {
  status: 'OK' | 'ERROR' | string;
  message: string;
  data: T;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, headers } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network request failed';
    throw new ApiError(`Cannot reach server: ${msg}`);
  }

  let json: Partial<ApiEnvelope<T>> | null = null;
  try {
    json = (await response.json()) as Partial<ApiEnvelope<T>>;
  } catch {
    // ignore — handled below
  }

  if (!response.ok) {
    throw new ApiError(json?.message || `Request failed (${response.status})`, response.status);
  }
  if (json?.status === 'ERROR') {
    throw new ApiError(json.message || 'Server returned an error', response.status);
  }
  return (json?.data as T) ?? (undefined as unknown as T);
}
