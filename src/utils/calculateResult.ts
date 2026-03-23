import { questions } from '../data/questions';
import {
  extraComments,
  finalMessages,
  openingTemplates,
  secondaryBlendTemplates,
  tagInsights,
  titleTemplates,
  typeProfiles,
} from '../data/resultTemplates';
import type { FortuneResult, ResultHistoryItem } from '../types/result';
import type { Answer, ResultType, ScoreMap } from '../types/quiz';
import { pickRandom, shuffle } from './random';

const emptyScores = (): ScoreMap => ({
  exhaustion: 0,
  misfire: 0,
  distrust: 0,
  stagnation: 0,
});

const typeOrder: ResultType[] = ['exhaustion', 'misfire', 'distrust', 'stagnation'];

export const calculateScores = (answers: Answer[]): ScoreMap => {
  return answers.reduce((scores, answer) => {
    const question = questions.find((item) => item.id === answer.questionId);
    const option = question?.options.find((item) => item.id === answer.optionId);

    if (!option) {
      return scores;
    }

    return {
      exhaustion: scores.exhaustion + option.scores.exhaustion,
      misfire: scores.misfire + option.scores.misfire,
      distrust: scores.distrust + option.scores.distrust,
      stagnation: scores.stagnation + option.scores.stagnation,
    };
  }, emptyScores());
};

const rankTypes = (scores: ScoreMap): ResultType[] => {
  return [...typeOrder].sort((left, right) => {
    const diff = scores[right] - scores[left];
    if (diff !== 0) {
      return diff;
    }

    return typeOrder.indexOf(left) - typeOrder.indexOf(right);
  });
};

const collectTags = (answers: Answer[]): string[] => {
  const tags = answers.flatMap((answer) => {
    const question = questions.find((item) => item.id === answer.questionId);
    const option = question?.options.find((item) => item.id === answer.optionId);
    return option?.tags ?? [];
  });

  return shuffle([...new Set(tags)]);
};

export const buildFortuneResult = (answers: Answer[]): FortuneResult => {
  const scores = calculateScores(answers);
  const ranked = rankTypes(scores);
  const primaryType = ranked[0];
  const secondaryType = ranked[1];
  const primaryProfile = typeProfiles[primaryType];
  const secondaryProfile = typeProfiles[secondaryType];
  const tags = collectTags(answers);
  const tagLine = tags.flatMap((tag) => tagInsights[tag] ?? [])[0];

  const summaryParts = [
    pickRandom(titleTemplates),
    pickRandom(openingTemplates),
    pickRandom(primaryProfile.summaries),
    pickRandom(secondaryBlendTemplates[secondaryType]),
    tagLine,
    pickRandom(secondaryProfile.extras),
  ].filter(Boolean);

  return {
    primaryType,
    secondaryType,
    title: `${pickRandom(titleTemplates)} | ${primaryProfile.label}ベース`,
    summary: summaryParts.slice(1).join(' '),
    love: pickRandom(primaryProfile.love),
    work: pickRandom(primaryProfile.work),
    money: pickRandom(primaryProfile.money),
    relationship: pickRandom(primaryProfile.relationship),
    finalMessage: pickRandom(finalMessages),
    extraComment: `${pickRandom(primaryProfile.extras)} ${pickRandom(extraComments)}`,
    timestamp: new Date().toISOString(),
  };
};

export const toHistoryItem = (result: FortuneResult): ResultHistoryItem => {
  return {
    id: `${result.timestamp}-${result.primaryType}-${result.secondaryType}`,
    createdAt: result.timestamp,
    primaryType: result.primaryType,
    secondaryType: result.secondaryType,
    title: result.title,
    summary: result.summary,
  };
};
