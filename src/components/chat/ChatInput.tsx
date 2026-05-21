import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { FiArrowUp, FiPaperclip } from 'react-icons/fi';

interface Props {
  onSend: (msg: string) => void;
  thinking?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, thinking, disabled }: Props) {
  const [value, setValue] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(e as unknown as FormEvent);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="relative w-full max-w-3xl mx-auto rounded-3xl"
    >
      <div className="rounded-[18px] glass-strong border border-white/10 px-4 py-3 flex items-end gap-3">
        <button type="button" aria-label="Attach" className="grid h-9 w-9 place-items-center rounded-xl text-tertiary hover:text-primary hover:bg-white/5">
          <FiPaperclip />
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={disabled}
          placeholder="Write your own answer..."
          className="flex-1 max-h-40 resize-none bg-transparent text-[15px] text-primary placeholder:text-tertiary outline-none py-2 scroll-thin disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={thinking || disabled || !value.trim()}
          aria-label="Send"
          className="grid h-10 w-10 place-items-center rounded-xl text-white bg-gradient-to-br from-[#1f86ff] to-[#8b6cff] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)]"
        >
          <FiArrowUp />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-tertiary">
        AI HelpDesk converges to a decision in ~5 structured steps. Press <kbd className="mono rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↵</kbd> to send.
      </p>
    </form>
  );
}
