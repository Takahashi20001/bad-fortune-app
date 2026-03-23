export type ResultType = 'exhaustion' | 'misfire' | 'distrust' | 'stagnation';

export type ScoreMap = Record<ResultType, number>;

export type Option = {
  id: string;
  label: string;
  scores: ScoreMap;
  tags?: string[];
};

export type Question = {
  id: number;
  category: string;
  text: string;
  options: Option[];
};

export type Answer = {
  questionId: number;
  optionId: string;
};

export type QuizPhase = 'home' | 'quiz' | 'loading' | 'result' | 'history';
