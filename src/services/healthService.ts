import { apiRequest } from './apiClient';

/* ---------------------- Types ---------------------- */

export interface InitialQuestion {
  id: number;
  title: string;
  description?: string;
  possible_answers: string[];
}

export interface AnswerPayload {
  id: number;
  answer: string;
}

export interface ChatQuestionResponse {
  chat_id: number;
  completion_percentage: number;
  total_questions: number;
  total_answered_questions: number;
  question: string;
  possible_answers: string[];
  question_id: number;
}

export type MyChat = {
  chat_id: number;
  chat_name: string;
  total_questions: number;
  total_answered_questions: number;
  completion_percentage: number;
};

export interface GetChatResponse {
  chat: {
    id: number;
    user_id: number;
    total_questions_asked: number;
    total_questions_answered: number;
    completion_percentage: number;
  };
  chat_questions: Array<{
    question_id: number;
    question_title: string;
    question_description?: string;
    selected_answer: string | null;
    possible_answers: string[];
  }>;
}

/* --------------------- Endpoints --------------------- */

export function getInitialQuestions(): Promise<InitialQuestion[]> {
  return apiRequest<InitialQuestion[]>('/get_initial_questions');
}

export function startChat(token: string, answers: AnswerPayload[]): Promise<ChatQuestionResponse> {
  return apiRequest<ChatQuestionResponse>('/start-chat', {
    method: 'POST',
    body: { token, answers },
  });
}

export function sendAnswer(
  token: string,
  chatId: number,
  answer: AnswerPayload,
): Promise<ChatQuestionResponse> {
  return apiRequest<ChatQuestionResponse>('/send-answer', {
    method: 'POST',
    body: { token, chat_id: chatId, answers: answer },
  });
}

export function getChat(token: string, chatId: number): Promise<GetChatResponse> {
  return apiRequest<GetChatResponse>('/get-chat', {
    method: 'POST',
    body: { token, chat_id: chatId },
  });
}

export function getMyChats(token: string): Promise<MyChat[]> {
  return apiRequest<MyChat[]>('/my-chats', {
    method: 'POST',
    body: { token },
  });
}
