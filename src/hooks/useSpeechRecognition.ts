import { useState, useEffect, useRef, useCallback } from 'react';

type SpeechRecognitionInstance = InstanceType<typeof window.SpeechRecognition>;

function getSpeechRecognition(): typeof window.SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  return (
    window.SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition })
      .webkitSpeechRecognition ??
    null
  );
}

export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef('');
  // Tracks whether stop() was called intentionally so onend doesn't restart
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
    // continuous = true keeps listening through natural speech pauses
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Ignore any buffered results that arrive after intentional stop
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
      // If stopped intentionally, fully close out
      if (stoppedIntentionallyRef.current) {
        setIsListening(false);
        recognitionRef.current = null;
        return;
      }
      // Otherwise the browser ended due to a pause — restart to keep listening
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
      // 'no-speech' and 'aborted' are expected during continuous mode — ignore them
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
