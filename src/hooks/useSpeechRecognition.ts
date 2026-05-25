import { useState, useEffect, useRef, useCallback } from 'react';

interface SR {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: ((ev: Event) => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onend: ((ev: Event) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}
type SRCtor = { new(): SR };

function getSpeechRecognition(): SRCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SR | null>(null);
  const finalTranscriptRef = useRef('');
  const stoppedIntentionallyRef = useRef(false);
  const isSupported = !!getSpeechRecognition();

  const stop = useCallback(() => {
    stoppedIntentionallyRef.current = true;
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) return;

    finalTranscriptRef.current = '';
    stoppedIntentionallyRef.current = false;

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (stoppedIntentionallyRef.current) return;
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      onTranscript(finalTranscriptRef.current + interim);
    };

    recognition.onend = () => {
      if (stoppedIntentionallyRef.current) {
        setIsListening(false);
        recognitionRef.current = null;
        return;
      }
      try {
        recognition.start();
      } catch {
        setIsListening(false);
        recognitionRef.current = null;
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        stoppedIntentionallyRef.current = true;
        setIsListening(false);
        recognitionRef.current = null;
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error('Microphone access denied. Please allow it in your browser settings.');
        });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript]);

  useEffect(() => {
    return () => {
      stoppedIntentionallyRef.current = true;
      recognitionRef.current?.stop();
    };
  }, []);

  return { isSupported, isListening, start, stop };
}
