const TOKEN_KEY = 'hd:auth_token';
const ACTIVE_CHAT_KEY = 'hd:active_chat_id';

export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* swallow quota errors */
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function saveActiveChatId(chatId: number): void {
  try {
    localStorage.setItem(ACTIVE_CHAT_KEY, String(chatId));
  } catch {
    /* noop */
  }
}

export function getActiveChatId(): number | null {
  try {
    const raw = localStorage.getItem(ACTIVE_CHAT_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function removeActiveChatId(): void {
  try {
    localStorage.removeItem(ACTIVE_CHAT_KEY);
  } catch {
    /* noop */
  }
}

export function clearAuth(): void {
  removeToken();
  removeActiveChatId();
}
