/**
 * @deprecated Use `@/services/healthService` and `@/features/auth/authStorage`
 * directly. This module is kept as a thin compatibility shim and only
 * re-exports types/functions from the new locations.
 */
export type {
  InitialQuestion,
  AnswerPayload,
  ChatQuestionResponse,
  GetChatResponse,
} from './healthService';

export {
  getInitialQuestions as fetchInitialQuestions,
  startChat,
  sendAnswer,
  getChat,
} from './healthService';

export { getToken } from '@/features/auth/authStorage';
export const TOKEN_KEY = 'hd:auth_token';
