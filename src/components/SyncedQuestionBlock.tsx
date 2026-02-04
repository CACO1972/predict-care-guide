import { useState, useEffect, useRef } from "react";
import RioAvatar from "./RioAvatar";
import QuestionCard from "./QuestionCard";
import { RioExpression } from "@/hooks/useRioExpression";

interface SyncedQuestionBlockProps {
  rioMessage: string;
  userName?: string;
  customAudioUrl?: string;
  useTTS?: boolean;
  expression?: RioExpression;
  question: string;
  type: 'text' | 'number' | 'radio' | 'gender' | 'checkbox';
  options?: { value: string; label: string }[];
  value?: string | number | string[];
  onChange: (value: string | number | string[]) => void;
  onNext: () => void;
  hideNextButton?: boolean;
  clinicalNote?: string;
  nextButtonText?: string;
  disabled?: boolean;
}

const SKIP_DELAY_MS = 3000;

/**
 * Wraps RioAvatar + QuestionCard with audio synchronization.
 * Options are hidden until audio finishes or user clicks skip after 3s.
 */
const SyncedQuestionBlock = ({
  rioMessage,
  userName,
  customAudioUrl,
  useTTS = false,
  expression = 'encouraging',
  question,
  type,
  options,
  value,
  onChange,
  onNext,
  hideNextButton = true,
  clinicalNote,
  nextButtonText,
  disabled
}: SyncedQuestionBlockProps) => {
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [isSkipAllowed, setIsSkipAllowed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when message changes (new question)
  useEffect(() => {
    setIsAudioFinished(false);
    setIsSkipAllowed(false);
    setIsPlaying(false);
    
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
    }
  }, [rioMessage]);

  const handleAudioStart = () => {
    setIsPlaying(true);
    setIsAudioFinished(false);
    setIsSkipAllowed(false);
    
    // Allow skip after 3 seconds
    skipTimerRef.current = setTimeout(() => {
      setIsSkipAllowed(true);
    }, SKIP_DELAY_MS);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setIsAudioFinished(true);
    setIsSkipAllowed(true);
    
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
    }
  };

  const handleSkip = () => {
    setIsPlaying(false);
    setIsAudioFinished(true);
    
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (skipTimerRef.current) {
        clearTimeout(skipTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <RioAvatar 
        message={rioMessage}
        userName={userName}
        expression={expression}
        customAudioUrl={customAudioUrl}
        useTTS={useTTS}
        onAudioStart={handleAudioStart}
        onAudioEnd={handleAudioEnd}
      />
      <QuestionCard
        question={question}
        type={type}
        options={options}
        value={value}
        onChange={onChange}
        onNext={onNext}
        hideNextButton={hideNextButton}
        clinicalNote={clinicalNote}
        nextButtonText={nextButtonText}
        disabled={disabled}
        isAudioPlaying={isPlaying}
        isAudioFinished={isAudioFinished}
        isSkipAllowed={isSkipAllowed}
        onSkipAudio={handleSkip}
      />
    </div>
  );
};

export default SyncedQuestionBlock;
