import { useEffect } from "react";

export const useDebugAutoAnswer = (
  enabled: boolean,
  question: { a: number; b: number },
  onAnswer: (answer: number) => void,
) => {
  useEffect(() => {
    if (!enabled) return;
    const timeout = setTimeout(() => {
      const result = question.a + question.b;
      const answer = result % 10;
      onAnswer(answer);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [question, enabled]);
};
