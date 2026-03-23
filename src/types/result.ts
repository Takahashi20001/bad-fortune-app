import type { ResultType } from './quiz';

export type FortuneResult = {
  primaryType: ResultType;
  secondaryType: ResultType;
  title: string;
  summary: string;
  love: string;
  work: string;
  money: string;
  relationship: string;
  finalMessage: string;
  extraComment: string;
  timestamp: string;
};

export type ResultHistoryItem = {
  id: string;
  createdAt: string;
  primaryType: ResultType;
  secondaryType: ResultType;
  title: string;
  summary: string;
};
