import type { ResultHistoryItem } from '../types/result';

const HISTORY_KEY = 'negative-fortune-history';

export const loadHistory = (): ResultHistoryItem[] => {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ResultHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveHistoryItem = (item: ResultHistoryItem): boolean => {
  try {
    const history = loadHistory();
    const nextHistory = [item, ...history].slice(0, 12);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    return true;
  } catch {
    return false;
  }
};

export const clearHistory = (): boolean => {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch {
    return false;
  }
};
