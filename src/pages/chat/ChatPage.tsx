import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BareLayout } from '@/app/layouts/BareLayout';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { AnswerOptions } from '@/components/chat/AnswerOptions';
import type { ChatMessage } from '@/types';
import { DECISION_JOURNEY } from '@/data/journeys';
import { pageTransition } from '@/utils/motion';
import {
  getInitialQuestions,
  startChat as apiStartChat,
  sendAnswer as apiSendAnswer,
  getChat as apiGetChat,
  type InitialQuestion,
  type AnswerPayload,
  type ChatQuestionResponse,
  type GetChatResponse,
} from '@/services/healthService';
import {
  getToken,
  getActiveChatId,
  saveActiveChatId,
  removeActiveChatId,
} from '@/features/auth/authStorage';

const THINKING_PLACEHOLDER: ChatMessage = {
  id: 'thinking',
  role: 'ai',
  content: '',
  createdAt: 0,
  thinking: true,
};

type Phase =
  | 'bootstrapping'      // loading initial questions / restoring previous chat
  | 'asking-initial'     // walking through GET /get_initial_questions
  | 'starting-chat'      // calling /start-chat
  | 'in-chat'            // exchanging Q/A with the AI
  | 'complete'           // 100% complete
  | 'error';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>('bootstrapping');
  const [initialQueue, setInitialQueue] = useState<InitialQuestion[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);
  const [collectedInitial, setCollectedInitial] = useState<AnswerPayload[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [progress, setProgress] = useState<{
    total: number;
    answered: number;
    percentage: number;
  } | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  /* ----------------------- Helpers ----------------------- */

  const pushAIQuestion = (text: string, options: string[], questionId: number) => {
    setMessages((m) => [
      ...m,
      {
        id: `q-${questionId}-${Date.now()}`,
        role: 'ai',
        content: text,
        createdAt: Date.now(),
        options,
        questionId,
      },
    ]);
    setCurrentQuestionId(questionId);
  };

  const pushUser = (text: string) => {
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: 'user', content: text, createdAt: Date.now() },
    ]);
  };

  const pushError = (msg: string) => {
    setErrorText(msg);
    setMessages((m) => [
      ...m,
      {
        id: `err-${Date.now()}`,
        role: 'ai',
        content: `Sorry — ${msg}`,
        createdAt: Date.now(),
      },
    ]);
  };

  const markLatestOptionsAnswered = () => {
    setMessages((m) => {
      const next = [...m];
      for (let i = next.length - 1; i >= 0; i--) {
        const msg = next[i];
        if (msg.role === 'ai' && msg.options && !msg.answered) {
          next[i] = { ...msg, answered: true };
          break;
        }
      }
      return next;
    });
  };

  const applyServerProgress = (resp: ChatQuestionResponse) => {
    setProgress({
      total: resp.total_questions,
      answered: resp.total_answered_questions,
      percentage: resp.completion_percentage,
    });
  };

  /**
   * Best-effort restore from /get-chat. The endpoint returns a history of
   * answered questions but does NOT return the next pending question, so the
   * safest behavior is: rehydrate the visible history, then surface a small
   * system note inviting the user to continue. If the chat is complete we
   * mark it complete. If the shape is unexpected we fail gracefully and the
   * caller falls back to a fresh flow.
   */
  const tryRestoreFromGetChat = (
    resp: GetChatResponse,
    restoredChatId: number,
  ): boolean => {
    const chatMeta = resp?.chat;
    const items = Array.isArray(resp?.chat_questions) ? resp.chat_questions : [];
    if (!chatMeta || items.length === 0) return false;

    const rehydrated: ChatMessage[] = [];
    for (const item of items) {
      rehydrated.push({
        id: `r-q-${item.question_id}`,
        role: 'ai',
        content: item.question_title,
        createdAt: Date.now(),
        options: item.possible_answers ?? [],
        questionId: item.question_id,
        answered: Boolean(item.selected_answer),
      });
      if (item.selected_answer) {
        rehydrated.push({
          id: `r-a-${item.question_id}`,
          role: 'user',
          content: item.selected_answer,
          createdAt: Date.now(),
        });
      }
    }
    setMessages(rehydrated);
    setChatId(restoredChatId);
    setProgress({
      total: chatMeta.total_questions_asked,
      answered: chatMeta.total_questions_answered,
      percentage: chatMeta.completion_percentage,
    });

    if (chatMeta.completion_percentage >= 100) {
      setPhase('complete');
      return true;
    }

    // We can't know what the NEXT question is from /get-chat alone (no field
    // for it in the documented response). Surface a friendly system note;
    // the next /send-answer call uses the last answered question id.
    const lastAnswered = [...items].reverse().find((i) => i.selected_answer);
    if (!lastAnswered) {
      return false;
    }
    setCurrentQuestionId(lastAnswered.question_id);
    setMessages((m) => [
      ...m,
      {
        id: `r-info-${Date.now()}`,
        role: 'system',
        content: 'restored — continue where you left off',
        createdAt: Date.now(),
      },
    ]);
    setPhase('in-chat');
    return true;
  };

  /* ----------------------- Bootstrapping ----------------------- */

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setPhase('bootstrapping');
      setThinking(true);
      setErrorText(null);
      const token = getToken();
      const existingChatId = getActiveChatId();

      // 1) Try to restore an in-progress chat if we have one.
      if (token && existingChatId != null) {
        try {
          const restored = await apiGetChat(token, existingChatId);
          if (cancelled) return;
          if (tryRestoreFromGetChat(restored, existingChatId)) {
            setThinking(false);
            return;
          }
          // Restoration was unclear — drop the stale id and start fresh.
          removeActiveChatId();
        } catch {
          // Server refused or chat is gone — clear and fall through.
          removeActiveChatId();
        }
      }

      // 2) Otherwise, fetch initial questions and ask the first one.
      try {
        const questions = await getInitialQuestions();
        if (cancelled) return;
        if (!questions || questions.length === 0) {
          throw new Error('No initial questions returned by the server.');
        }
        setInitialQueue(questions);
        setInitialIndex(0);
        setCollectedInitial([]);
        setProgress({ total: questions.length, answered: 0, percentage: 0 });
        const first = questions[0];
        pushAIQuestion(first.title, first.possible_answers, first.id);
        setPhase('asking-initial');
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to load questions.';
        pushError(msg);
        setPhase('error');
      } finally {
        if (!cancelled) setThinking(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ----------------------- Submission ----------------------- */

  /** Unified handler used by BOTH option clicks and the free-text input. */
  const submitAnswer = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (phase === 'complete' || phase === 'bootstrapping' || phase === 'starting-chat') return;
    if (currentQuestionId == null) return;

    pushUser(trimmed);
    markLatestOptionsAnswered();
    setThinking(true);
    setErrorText(null);

    try {
      if (phase === 'asking-initial') {
        const answer: AnswerPayload = { id: currentQuestionId, answer: trimmed };
        const nextAnswers = [...collectedInitial, answer];
        setCollectedInitial(nextAnswers);

        const nextIndex = initialIndex + 1;
        if (nextIndex < initialQueue.length) {
          const q = initialQueue[nextIndex];
          setInitialIndex(nextIndex);
          setProgress((p) => (p ? { ...p, answered: nextAnswers.length } : p));
          pushAIQuestion(q.title, q.possible_answers, q.id);
        } else {
          // All initial answers collected → call /start-chat
          const token = getToken();
          if (!token) throw new Error('You are not logged in.');
          setPhase('starting-chat');
          const resp = await apiStartChat(token, nextAnswers);
          setChatId(resp.chat_id);
          saveActiveChatId(resp.chat_id);
          applyServerProgress(resp);
          if (resp.question && resp.question_id != null) {
            pushAIQuestion(resp.question, resp.possible_answers ?? [], resp.question_id);
          }
          setPhase(resp.completion_percentage >= 100 ? 'complete' : 'in-chat');
        }
      } else if (phase === 'in-chat') {
        const token = getToken();
        if (!token) throw new Error('You are not logged in.');
        if (chatId == null) throw new Error('Missing chat id.');
        const resp = await apiSendAnswer(token, chatId, {
          id: currentQuestionId,
          answer: trimmed,
        });
        applyServerProgress(resp);
        if (resp.question && resp.question_id != null) {
          pushAIQuestion(resp.question, resp.possible_answers ?? [], resp.question_id);
        }
        if (resp.completion_percentage >= 100) {
          setPhase('complete');
          removeActiveChatId();
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      pushError(msg);
      // Only force the 'error' phase if we're not already mid-flow; otherwise
      // let the user retry by clicking another option or typing.
    } finally {
      setThinking(false);
    }
  };

  /* ----------------------- Effects ----------------------- */

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  /* ----------------------- New journey ----------------------- */

  const startNew = async () => {
    removeActiveChatId();
    setMessages([]);
    setChatId(null);
    setCurrentQuestionId(null);
    setProgress(null);
    setErrorText(null);
    setCollectedInitial([]);
    setInitialIndex(0);
    setInitialQueue([]);
    setPhase('bootstrapping');
    setThinking(true);
    try {
      const questions = await getInitialQuestions();
      if (!questions || questions.length === 0) throw new Error('No initial questions returned.');
      setInitialQueue(questions);
      setProgress({ total: questions.length, answered: 0, percentage: 0 });
      pushAIQuestion(questions[0].title, questions[0].possible_answers, questions[0].id);
      setPhase('asking-initial');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load questions.';
      pushError(msg);
      setPhase('error');
    } finally {
      setThinking(false);
    }
  };

  /* ----------------------- Render ----------------------- */

  // Find the latest AI message with unanswered options to render the option grid under.
  const latestOptionsMessageId = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'ai' && m.options && m.options.length > 0 && !m.answered) return m.id;
    }
    return null;
  })();
  const optionsForLatest =
    messages.find((m) => m.id === latestOptionsMessageId)?.options ?? [];

  const isEmpty = messages.length === 0;
  const headerTitle =
    phase === 'complete'
      ? 'Decision Journey · complete'
      : isEmpty
        ? 'New Decision Journey'
        : 'Decision Journey · in progress';

  const totalSteps = progress?.total ?? DECISION_JOURNEY.length;
  const step = progress
    ? Math.max(1, Math.min(progress.answered + (phase === 'complete' ? 0 : 1), totalSteps))
    : 1;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="enter" exit="exit">
      <BareLayout>
        <div className="grid h-screen overflow-hidden lg:grid-cols-[280px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block min-h-0 h-screen" data-lenis-prevent>
            <Sidebar onNewJourney={startNew} />
          </div>

          {/* Mobile sidebar drawer */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                  className="lg:hidden fixed inset-y-0 left-0 z-50 w-72"
                  data-lenis-prevent
                >
                  <Sidebar onNewJourney={() => { startNew(); setSidebarOpen(false); }} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main column */}
          <div className="flex h-screen flex-col min-w-0 min-h-0 overflow-hidden">
            <ChatHeader
              title={headerTitle}
              step={step}
              totalSteps={totalSteps}
              onToggleSidebar={() => setSidebarOpen(true)}
            />

            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto scroll-thin overscroll-contain"
              data-lenis-prevent
            >
              <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 pb-10 flex flex-col gap-5 min-h-full">
                {messages.map((m, i) => (
                  <MessageBubble key={m.id} message={m} index={i} />
                ))}

                {/* Options for the latest unanswered AI question */}
                {latestOptionsMessageId && !thinking && phase !== 'complete' && (
                  <div className="pl-11 -mt-1 relative">
                    {/* Vertical connector: aligned with the AI avatar's
                        center (16px), gradient that fades from brand blue
                        to violet and into transparent. Decorative only. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-4 -top-4 bottom-2 w-px rounded-full"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(74,166,255,0.6), rgba(139,108,255,0.3) 55%, transparent)',
                        boxShadow: '0 0 8px rgba(74,166,255,0.25)',
                      }}
                    />
                    <AnswerOptions
                      options={optionsForLatest}
                      disabled={thinking || phase === 'starting-chat'}
                      onSelect={submitAnswer}
                    />
                  </div>
                )}

                {thinking && (
                  <MessageBubble
                    index={messages.length}
                    message={THINKING_PLACEHOLDER}
                  />
                )}

                {phase === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="self-center mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand-300)] py-3"
                  >
                    — assessment complete —
                  </motion.div>
                )}
              </div>
            </div>

            <div className="border-t border-white/5 glass-strong px-4 md:px-6 py-4">
              <ChatInput
                onSend={submitAnswer}
                thinking={thinking}
                disabled={phase === 'complete' || phase === 'bootstrapping' || phase === 'starting-chat'}
              />
              {errorText && (
                <p className="mt-2 text-center text-[11px] text-[var(--accent-rose)]">
                  {errorText}
                </p>
              )}
            </div>
          </div>
        </div>
      </BareLayout>
    </motion.div>
  );
}
