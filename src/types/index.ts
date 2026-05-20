export type ThemeMode = 'dark' | 'light';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  createdAt: number;
  thinking?: boolean;
  /** Selectable answers attached to this (AI) question, if any. */
  options?: string[];
  /** Backend question id this message refers to. */
  questionId?: number;
  /** True once the user has answered this question (hides its option boxes). */
  answered?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  domain: 'career' | 'medical' | 'legal' | 'life' | 'business';
  preview: string;
  updatedAt: number;
  messages?: ChatMessage[];
}

export interface DecisionStep {
  id: string;
  title: string;
  description: string;
  type: 'question' | 'branch' | 'outcome';
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent?: string;
}
