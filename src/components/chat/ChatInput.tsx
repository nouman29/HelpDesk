import { useState, useRef, useCallback, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { FiArrowUp, FiPaperclip, FiMic, FiMicOff } from 'react-icons/fi';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface Props {
  onSend: (msg: string) => void;
  thinking?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, thinking, disabled }: Props) {
  const [value, setValue] = useState('');
  const baseTextRef = useRef('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleTranscript = useCallback((transcript: string) => {
    const prefix = baseTextRef.current;
    setValue(prefix + (prefix ? ' ' : '') + transcript);
  }, []);

  const { isSupported, isListening, start, stop } = useSpeechRecognition(handleTranscript);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isListening) stop();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    baseTextRef.current = '';
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(e as unknown as FormEvent);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stop();
    } else {
      baseTextRef.current = value.trim();
      start();
    }
  };

  const inputDisabled = disabled || thinking;

  return (
    <form
      onSubmit={submit}
      className="relative w-full max-w-3xl mx-auto rounded-3xl"
    >
      <div className="rounded-[18px] glass-strong border border-white/10 px-4 py-3 flex items-end gap-3">
        <button
          type="button"
          aria-label="Attach"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-tertiary hover:text-primary hover:bg-white/5"
        >
          <FiPaperclip />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!isListening) baseTextRef.current = e.target.value;
          }}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={inputDisabled}
          placeholder={isListening ? 'Listening…' : 'Write your own answer…'}
          className="flex-1 resize-none bg-transparent text-[15px] text-primary placeholder:text-tertiary outline-none py-2 scroll-thin overflow-y-auto disabled:opacity-50"
          style={{ minHeight: '36px', maxHeight: '160px' }}
        />

        {isSupported && (
          <button
            type="button"
            onClick={toggleMic}
            disabled={inputDisabled}
            aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            className={[
              'relative grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
              isListening
                ? 'text-white bg-red-500 hover:bg-red-600'
                : 'text-tertiary hover:text-primary hover:bg-white/5',
            ].join(' ')}
          >
            {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
            {isListening && (
              <span className="absolute inset-0 rounded-xl animate-ping bg-red-500 opacity-40 pointer-events-none" />
            )}
          </button>
        )}

        <button
          type="submit"
          disabled={thinking || disabled || !value.trim()}
          aria-label="Send"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white bg-linear-to-br from-[#1f86ff] to-[#8b6cff] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)]"
        >
          <FiArrowUp />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-tertiary">
        AI HelpDesk converges to a decision.
      </p>
    </form>
  );
}
