import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BareLayout } from '@/app/layouts/BareLayout';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { AnswerOptions } from '@/components/chat/AnswerOptions';
import { ConclusionsView } from '@/components/chat/ConclusionsView';
import type { ChatMessage } from '@/types';
import { DECISION_JOURNEY } from '@/data/journeys';
import { pageTransition } from '@/utils/motion';
import { CONCLUSION_THRESHOLD } from '@/constants/chat';
import {
  getInitialQuestions,
  startChat as apiStartChat,
  sendAnswer as apiSendAnswer,
  concludeChat as apiConcludeChat,
  getChat as apiGetChat,
  type InitialQuestion,
  type AnswerPayload,
  type ChatQuestionResponse,
  type GetChatResponse,
  type Conclusion,
} from '@/services/healthService';
import {
  getToken,
  getActiveChatId,
  saveActiveChatId,
  removeActiveChatId,
} from '@/features/auth/authStorage';
import { showErrorToast } from '@/utils/toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { requestChatListRefresh } from '@/features/chat/chatListRefresh';

function Combobox({
  options,
  value,
  onChange,
  isOpen,
  onToggle,
  placeholder = "Select or type an answer..."
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  placeholder?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggle]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onToggle(true)}
          placeholder={placeholder}
          className="w-full rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#1f86ff] focus:ring-1 focus:ring-[#1f86ff]/50 px-3.5 py-2.5 pr-10 text-xs text-primary placeholder-tertiary transition-all outline-none"
        />
        <button
          type="button"
          onClick={() => onToggle(!isOpen)}
          className="absolute right-3 p-1 text-tertiary hover:text-secondary transition-colors"
        >
          <svg
            className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-xl glass-strong border border-white/10 shadow-2xl scroll-thin"
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    onToggle(false);
                  }}
                  className="w-full text-left text-xs text-secondary hover:text-primary hover:bg-[#1f86ff]/10 rounded-lg px-3 py-2 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  | 'concluding'         // calling /conclude-chat
  | 'complete'           // chat is concluded — show ConclusionsView
  | 'error';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLgUp = useMediaQuery('(min-width: 1024px)');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLgUp) setSidebarOpen(false);
  }, [isLgUp]);

  const [phase, setPhase] = useState<Phase>('bootstrapping');
  const [initialQueue, setInitialQueue] = useState<InitialQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [activeComboboxId, setActiveComboboxId] = useState<number | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [progress, setProgress] = useState<{
    total: number;
    answered: number;
    percentage: number;
  } | null>(null);
  const [conclusions, setConclusions] = useState<Conclusion[]>([]);

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
   * Best-effort restore from /get-chat.
   *
   *  - Rehydrates the visible Q/A history.
   *  - If the chat already carries `chat_conclusions`, jumps straight to the
   *    `complete` phase and shows the conclusions list.
   *  - Otherwise, points `currentQuestionId` at the first UNANSWERED question
   *    (the next one the user needs to answer) and resumes `in-chat`.
   *  - If the shape is unexpected we fail gracefully and the caller falls
   *    back to a fresh flow.
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

    // If the server already produced conclusions, treat the chat as complete.
    const restoredConclusions = Array.isArray(resp.chat_conclusions)
      ? resp.chat_conclusions
      : [];
    if (restoredConclusions.length > 0 || chatMeta.completion_percentage >= 100) {
      setConclusions(restoredConclusions);
      setPhase('complete');
      // No further user action — clear the active id so the next session
      // doesn't try to restore a finished chat.
      removeActiveChatId();
      return true;
    }

    // Otherwise, find the FIRST unanswered question (this is the one the
    // user must answer next). Per the spec: "if the chat is not concluded
    // so there must be the last question must be not answered yet."
    const pending = items.find((i) => !i.selected_answer);
    if (!pending) {
      // Every question is answered but completion < 100% and no conclusions
      // — shape unexpected, fall back to a fresh flow.
      return false;
    }
    setCurrentQuestionId(pending.question_id);
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

      // 2) Otherwise, fetch initial questions.
      try {
        const questions = await getInitialQuestions();
        if (cancelled) return;
        if (!questions || questions.length === 0) {
          throw new Error('No initial questions returned by the server.');
        }
        setInitialQueue(questions);
        setProgress({ total: questions.length, answered: 0, percentage: 0 });
        setPhase('asking-initial');
      } catch (err) {
        if (cancelled) return;
        showErrorToast(err, 'chat');
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
    if (
      phase === 'complete' ||
      phase === 'bootstrapping' ||
      phase === 'starting-chat' ||
      phase === 'concluding'
    )
      return;
    if (currentQuestionId == null) return;

    pushUser(trimmed);
    markLatestOptionsAnswered();
    setThinking(true);

    try {
      if (phase === 'in-chat') {
        const token = getToken();
        if (!token) throw new Error('You are not logged in.');
        if (chatId == null) throw new Error('Missing chat id.');

        // Decide which endpoint to call based on the LAST server-reported
        // completion percentage. Per spec: once it crosses the threshold
        // (e.g. > 90%), the next user submission goes to /conclude-chat
        // rather than /send-answer.
        const currentPct = progress?.percentage ?? 0;
        const answer: AnswerPayload = { id: currentQuestionId, answer: trimmed };

        if (currentPct > CONCLUSION_THRESHOLD) {
          setPhase('concluding');
          const result = await apiConcludeChat(token, chatId, answer);
          setConclusions(Array.isArray(result) ? result : []);
          setProgress((p) =>
            p ? { ...p, answered: p.answered + 1, percentage: 100 } : p,
          );
          setPhase('complete');
          removeActiveChatId();
          requestChatListRefresh();
        } else {
          const resp = await apiSendAnswer(token, chatId, answer);
          applyServerProgress(resp);
          if (resp.question && resp.question_id != null) {
            pushAIQuestion(resp.question, resp.possible_answers ?? [], resp.question_id);
          }
          // Safety net: if the backend itself reports 100% we still
          // wrap up gracefully even though we expected to conclude
          // via the threshold branch above.
          if (resp.completion_percentage >= 100) {
            setPhase('complete');
            removeActiveChatId();
            requestChatListRefresh();
          }
        }
      }
    } catch (err) {
      showErrorToast(err, 'chat');
      // If we failed mid-conclude, drop back to in-chat so the user can retry.
      setPhase((p) => (p === 'concluding' ? 'in-chat' : p));
    } finally {
      setThinking(false);
    }
  };

  /** Handles the bulk submission of the 10 initial questions */
  const handleInitialSubmit = async () => {
    const unanswered = initialQueue.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      showErrorToast(
        new Error(`Please select an answer for all questions before starting your consultation.`),
        'chat'
      );
      return;
    }

    const answers: AnswerPayload[] = initialQueue.map((q) => ({
      id: q.id,
      answer: selectedAnswers[q.id],
    }));

    setThinking(true);
    const token = getToken();
    if (!token) {
      showErrorToast(new Error('You are not logged in.'), 'chat');
      setThinking(false);
      return;
    }

    try {
      // 1. Pre-populate the message history with all 10 QA pairs for visual continuity
      const initialMessages: ChatMessage[] = [];
      initialQueue.forEach((q) => {
        const chosenAnswer = selectedAnswers[q.id];
        initialMessages.push({
          id: `q-${q.id}-${Date.now()}`,
          role: 'ai',
          content: q.title,
          createdAt: Date.now(),
          options: q.possible_answers,
          questionId: q.id,
          answered: true,
        });
        initialMessages.push({
          id: `u-${q.id}-${Date.now()}`,
          role: 'user',
          content: chosenAnswer,
          createdAt: Date.now(),
        });
      });
      setMessages(initialMessages);

      // 2. Start the chat in backend
      setPhase('starting-chat');
      const resp = await apiStartChat(token, answers);
      setChatId(resp.chat_id);
      saveActiveChatId(resp.chat_id);
      applyServerProgress(resp);
      
      if (resp.question && resp.question_id != null) {
        pushAIQuestion(resp.question, resp.possible_answers ?? [], resp.question_id);
      }
      setPhase('in-chat');
      requestChatListRefresh();
    } catch (err) {
      showErrorToast(err, 'chat');
      setMessages([]);
      setPhase('asking-initial');
    } finally {
      setThinking(false);
    }
  };

  /* ----------------------- Effects ----------------------- */

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking, conclusions]);

  /* ----------------------- New journey ----------------------- */

  const startNew = async () => {
    removeActiveChatId();
    setMessages([]);
    setChatId(null);
    setCurrentQuestionId(null);
    setProgress(null);
    setConclusions([]);
    setSelectedAnswers({});
    setActiveComboboxId(null);
    setInitialQueue([]);
    setPhase('bootstrapping');
    setThinking(true);
    try {
      const questions = await getInitialQuestions();
      if (!questions || questions.length === 0) throw new Error('No initial questions returned.');
      setInitialQueue(questions);
      setProgress({ total: questions.length, answered: 0, percentage: 0 });
      setPhase('asking-initial');
    } catch (err) {
      showErrorToast(err, 'chat');
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
      : phase === 'concluding'
        ? 'Decision Journey · concluding'
        : isEmpty
          ? 'New Decision Journey'
          : 'Decision Journey · in progress';

  const totalSteps = progress?.total ?? DECISION_JOURNEY.length;
  const step = progress
    ? Math.max(1, Math.min(progress.answered + (phase === 'complete' ? 0 : 1), totalSteps))
    : 1;

  const inputDisabled =
    phase === 'asking-initial' ||
    phase === 'complete' ||
    phase === 'bootstrapping' ||
    phase === 'starting-chat' ||
    phase === 'concluding';

  return (
    <motion.div variants={pageTransition} initial="initial" animate="enter" exit="exit">
      <BareLayout>
        <div className="grid h-screen overflow-hidden lg:grid-cols-[280px_1fr]">
          {/* Desktop sidebar — not mounted on mobile (avoids duplicate SVG ids / API calls) */}
          {isLgUp && (
            <div className="min-h-0 h-screen" data-lenis-prevent>
              <Sidebar onNewJourney={startNew} />
            </div>
          )}

          {/* Mobile sidebar drawer */}
          <AnimatePresence>
            {!isLgUp && sidebarOpen && (
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
              {phase === 'asking-initial' ? (
                <div className="mx-auto max-w-5xl px-4 md:px-6 py-8 pb-16 flex flex-col gap-8 min-h-full">
                  {/* Header */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1f86ff] to-[#8b6cff] bg-clip-text text-transparent">
                      Initial Health Assessment
                    </h1>
                    <p className="text-sm text-secondary max-w-2xl leading-relaxed">
                      Please answer these 10 initial questions to help us identify your concerns, medical background, and construct a detailed clinical history.
                    </p>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {initialQueue.map((q, index) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        style={{ zIndex: activeComboboxId === q.id ? 50 : 1 }}
                        className="relative group rounded-2xl glass border border-white/5 hover:border-white/12 p-5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-secondary group-hover:bg-[#1f86ff]/10 group-hover:text-[#1f86ff] transition-colors">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-primary group-hover:text-[#8b6cff] transition-colors line-clamp-2">
                              {q.title}
                            </h3>
                            <p className="text-xs text-tertiary mt-1.5 leading-relaxed min-h-[32px]">
                              {q.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Combobox
                            options={q.possible_answers}
                            value={selectedAnswers[q.id] || ''}
                            isOpen={activeComboboxId === q.id}
                            onToggle={(open) => setActiveComboboxId(open ? q.id : null)}
                            onChange={(val) => {
                              setSelectedAnswers(prev => ({
                                ...prev,
                                [q.id]: val
                              }));
                            }}
                            placeholder="Type or select an answer..."
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Submit Action */}
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                    <div className="text-sm text-secondary">
                      {Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)]).length} of 10 questions answered
                    </div>
                    <button
                      onClick={handleInitialSubmit}
                      disabled={thinking}
                      className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white bg-gradient-to-br from-[#1f86ff] to-[#8b6cff] shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)] hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {thinking ? 'Starting consultation...' : 'Start Decision Journey'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 pb-10 flex flex-col gap-5 min-h-full">
                  {messages.map((m, i) => (
                    <MessageBubble key={m.id} message={m} index={i} />
                  ))}

                  {/* Options for the latest unanswered AI question */}
                  {latestOptionsMessageId && !thinking && phase !== 'complete' && phase !== 'concluding' && (
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
                    <ConclusionsView
                      conclusions={conclusions}
                      onStartAnother={startNew}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 glass-strong px-4 md:px-6 py-4">
              <ChatInput
                onSend={submitAnswer}
                thinking={thinking}
                disabled={inputDisabled}
              />
            </div>
          </div>
        </div>
      </BareLayout>
    </motion.div>
  );
}
