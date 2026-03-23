import { useEffect, useMemo, useState } from 'react';
import { questions } from '../data/questions';
import type { FortuneResult } from '../types/result';
import type { Answer, QuizPhase } from '../types/quiz';
import { buildFortuneResult, toHistoryItem } from '../utils/calculateResult';
import { loadHistory, saveHistoryItem } from '../utils/storage';

const loadingDurationMs = 3200;

export const useQuiz = () => {
  const [phase, setPhase] = useState<QuizPhase>('home');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [history, setHistory] = useState(() => loadHistory());
  const [storageMessage, setStorageMessage] = useState<string | null>(null);

  const answerList: Answer[] = useMemo(
    () =>
      Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: Number(questionId),
        optionId,
      })),
    [answers],
  );

  const currentQuestion = questions[currentIndex];
  const isComplete = answerList.length === questions.length;

  useEffect(() => {
    if (phase !== 'loading') {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingStep((previous) => (previous + 1) % 3);
    }, 900);

    const timer = window.setTimeout(() => {
      const nextResult = buildFortuneResult(answerList);
      setResult(nextResult);

      const saved = saveHistoryItem(toHistoryItem(nextResult));
      if (saved) {
        setHistory(loadHistory());
      }
      setStorageMessage(saved ? null : '履歴保存に失敗しましたが、診断結果は表示できます。');
      setPhase('result');
    }, loadingDurationMs);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [answerList, phase]);

  const selectAnswer = (questionId: number, optionId: string) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));
  };

  const startQuiz = () => {
    setPhase('quiz');
    setCurrentIndex(0);
    setStorageMessage(null);
  };

  const goToHistory = () => {
    setPhase('history');
  };

  const goHome = () => {
    setPhase('home');
  };

  const nextQuestion = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) {
      return;
    }

    if (currentIndex === questions.length - 1) {
      setPhase('loading');
      setLoadingStep(0);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
  };

  const previousQuestion = () => {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setLoadingStep(0);
    setStorageMessage(null);
    setPhase('home');
  };
  return {
    phase,
    currentIndex,
    currentQuestion,
    questions,
    answers,
    result,
    history,
    loadingStep,
    storageMessage,
    isComplete,
    startQuiz,
    goHome,
    goToHistory,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    restartQuiz,
  };
};
