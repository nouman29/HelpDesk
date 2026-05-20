/**
 * Centralized route definitions.
 * All navigation across the app should reference these constants.
 */
export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CHAT: '/chat',
  RECENT_CHATS: '/recent-chats',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
