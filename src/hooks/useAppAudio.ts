import { useEffect, useRef } from 'react';
import type { QuizPhase } from '../types/quiz';

const safePlay = async (audio: HTMLAudioElement, fromStart = false) => {
  try {
    if (fromStart) {
      audio.currentTime = 0;
    }
    await audio.play();
  } catch {
    // Ignore autoplay and decoding errors; the UI should continue working.
  }
};

const fadeTo = (audio: HTMLAudioElement, targetVolume: number) => {
  audio.volume = Math.max(0, Math.min(targetVolume, 1));
};

export const useAppAudio = (phase: QuizPhase) => {
  const unlockedRef = useRef(false);
  const previousPhaseRef = useRef<QuizPhase>(phase);
  const quizBgmRef = useRef<HTMLAudioElement | null>(null);
  const darkBgmRef = useRef<HTMLAudioElement | null>(null);
  const clickSeRef = useRef<HTMLAudioElement | null>(null);
  const resultSeRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const quizBgm = new Audio('/ancient-memories.mp3');
    quizBgm.loop = true;
    quizBgm.preload = 'auto';

    const darkBgm = new Audio('/utau-kizu.mp3');
    darkBgm.loop = true;
    darkBgm.preload = 'auto';

    const clickSe = new Audio('/click-se.mp3');
    clickSe.preload = 'auto';

    const resultSe = new Audio('/result-se.mp3');
    resultSe.preload = 'auto';

    quizBgmRef.current = quizBgm;
    darkBgmRef.current = darkBgm;
    clickSeRef.current = clickSe;
    resultSeRef.current = resultSe;

    return () => {
      [quizBgm, darkBgm, clickSe, resultSe].forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  useEffect(() => {
    const quizBgm = quizBgmRef.current;
    const darkBgm = darkBgmRef.current;

    if (!quizBgm || !darkBgm || !unlockedRef.current) {
      previousPhaseRef.current = phase;
      return;
    }

    if (phase === 'quiz') {
      darkBgm.pause();
      fadeTo(quizBgm, 0.22);
      void safePlay(quizBgm);
    } else if (phase === 'loading') {
      quizBgm.pause();
      darkBgm.currentTime = 0;
      fadeTo(darkBgm, 0.18);
      void safePlay(darkBgm);
    } else if (phase === 'result') {
      quizBgm.pause();
      fadeTo(darkBgm, 0.14);
      void safePlay(darkBgm);

      if (previousPhaseRef.current !== 'result' && resultSeRef.current) {
        resultSeRef.current.volume = 0.45;
        void safePlay(resultSeRef.current, true);
      }
    } else {
      quizBgm.pause();
      darkBgm.pause();
    }

    previousPhaseRef.current = phase;
  }, [phase]);

  const unlockAudio = () => {
    unlockedRef.current = true;
  };

  const playClick = () => {
    unlockAudio();

    const clickSe = clickSeRef.current;
    if (!clickSe) {
      return;
    }

    clickSe.volume = 0.42;
    void safePlay(clickSe, true);
  };

  const playResultSting = () => {
    unlockAudio();

    const resultSe = resultSeRef.current;
    if (!resultSe) {
      return;
    }

    resultSe.volume = 0.45;
    void safePlay(resultSe, true);
  };

  return {
    unlockAudio,
    playClick,
    playResultSting,
  };
};
