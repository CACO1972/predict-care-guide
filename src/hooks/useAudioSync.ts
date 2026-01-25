import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAudioSyncReturn {
  isAudioFinished: boolean;
  isSkipAllowed: boolean;
  isPlaying: boolean;
  startAudio: () => void;
  onAudioEnd: () => void;
  onSkip: () => void;
  reset: () => void;
}

const SKIP_DELAY_MS = 3000;

export const useAudioSync = (): UseAudioSyncReturn => {
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [isSkipAllowed, setIsSkipAllowed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAudio = useCallback(() => {
    setIsPlaying(true);
    setIsAudioFinished(false);
    setIsSkipAllowed(false);
    
    // Allow skip after 3 seconds
    skipTimerRef.current = setTimeout(() => {
      setIsSkipAllowed(true);
    }, SKIP_DELAY_MS);
  }, []);

  const onAudioEnd = useCallback(() => {
    setIsPlaying(false);
    setIsAudioFinished(true);
    setIsSkipAllowed(true);
    
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
    }
  }, []);

  const onSkip = useCallback(() => {
    setIsPlaying(false);
    setIsAudioFinished(true);
    
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    setIsAudioFinished(false);
    setIsSkipAllowed(false);
    setIsPlaying(false);
    
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (skipTimerRef.current) {
        clearTimeout(skipTimerRef.current);
      }
    };
  }, []);

  return {
    isAudioFinished,
    isSkipAllowed,
    isPlaying,
    startAudio,
    onAudioEnd,
    onSkip,
    reset,
  };
};
