/** Tiny typed wrapper over localStorage. */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* swallow quota errors */
    }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  },
};
