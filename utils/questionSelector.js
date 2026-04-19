import { classifyWords } from "./wordStats.js";
import { WORDS } from "../deta/words.js";

export const STAGES = [
  { stage: 1, startId: 1, endId: 200 },
  { stage: 2, startId: 201, endId: 400 },
  { stage: 3, startId: 401, endId: 600 },
  { stage: 4, startId: 601, endId: 800 },
  { stage: 5, startId: 801, endId: 1000 },
  { stage: 6, startId: 1001, endId: 1200 },
  { stage: 7, startId: 1201, endId: 1480 },
  { stage: 8, startId: 1, endId: 1480 }
];

export function getStageRange(stage) {
  return STAGES.find((s) => s.stage === stage) ?? STAGES[0];
}

export function wordsForStage(stage) {
  const r = getStageRange(stage);
  return WORDS.filter((w) => w.id >= r.startId && w.id <= r.endId);
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function preventImmediateRepeat(list, lastWordId) {
  if (!list.length || !lastWordId || list[0]?.id !== lastWordId) {
    return list;
  }

  const swapIndex = list.findIndex((word) => word.id !== lastWordId);
  if (swapIndex <= 0) return list;

  const moved = [...list];
  [moved[0], moved[swapIndex]] = [moved[swapIndex], moved[0]];
  return moved;
}

function fillQuestionsFromPool(pool, count = 10, lastWordId = null) {
  if (!pool.length) {
    const fallback = Array.from({ length: count }, () => randomWord());
    return preventImmediateRepeat(fallback, lastWordId);
  }
  
  const out = [];
  let prevId = lastWordId;

  while (out.length < count) {
    const cycle = shuffle(pool);
    for (const word of cycle) {
      if (out.length >= count) break;

      if (word.id === prevId) {
        const alternative = cycle.find((candidate) => candidate.id !== prevId && !out.includes(candidate));
        if (alternative) {
          out.push(alternative);
          prevId = alternative.id;
          continue;
        }
      }

      out.push(word);
      prevId = word.id;
    }
  }

  return out;
}

function pick(pool, count = 10, lastWordId = null) {
  return fillQuestionsFromPool(pool, count, lastWordId);
}

function pickPrioritizedByAnswerCount(pool, state, count = 10) {
  if (!pool.length) {
    return Array.from({ length: count }, () => randomWord());
  }

  const stats = state?.wordStats ?? {};
  const prioritized = [...pool]
    .map((word) => ({ word, total: stats[word.id]?.total ?? 0, tie: Math.random() }))
    .sort((a, b) => (a.total - b.total) || (a.tie - b.tie))
    .map(({ word }) => word);

  return fillQuestionsFromPool(prioritized, count, state?.lastQuestionWordId ?? null);
}

export function selectQuestionSet({ command, stage, state, isBoss = false }) {
  const stageWords = wordsForStage(stage);
  const { strong, weak, unseen } = classifyWords(stageWords, state);
  const lastWordId = state?.lastQuestionWordId ?? null;
  
  if (isBoss) {
    const prioritized = [...weak].sort((a, b) => a.accuracy - b.accuracy);
    return pick(prioritized.length ? prioritized : stageWords, 10, lastWordId);
  }

  if (command === "heal") {
    return pickPrioritizedByAnswerCount(strong.length ? strong : stageWords, state, 10);
  }
  if (command === "power") {
    const fallback = unseen.length ? unseen : stageWords;
    return pickPrioritizedByAnswerCount(weak.length ? weak : fallback, state, 10);
  }
  
  if (command === "attack") {
    return pickPrioritizedByAnswerCount(stageWords, state, 10);
  }

  return pick(stageWords, 10, lastWordId);
}
