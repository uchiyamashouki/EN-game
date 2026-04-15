import { WORDS } from "../data/words.js";
import { classifyWords, getAccuracy } from "./wordStats.js";

export const STAGES = [
  { stage: 1, startId: 1, endId: 200 },
  { stage: 2, startId: 201, endId: 400 },
  { stage: 3, startId: 401, endId: 600 },
  { stage: 4, startId: 601, endId: 800 },
  { stage: 5, startId: 801, endId: 1000 },
  { stage: 6, startId: 1001, endId: 1200 },
  { stage: 7, startId: 1201, endId: 1477 },
  { stage: 8, startId: 1, endId: 1477 }
];

/**
 * ステージ範囲を取得
 */
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

function pick(pool, count = 10) {
  const list = pool.length ? shuffle(pool) : [];
  const out = [];
  while (out.length < count) {
    out.push(list[out.length % Math.max(1, list.length)] || WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return out;
}

export function selectQuestionSet({ command, stage, state, isBoss = false }) {
  const stageWords = wordsForStage(stage);
  const { strong, weak } = classifyWords(stageWords, state);

   if (isBoss) {
    const sortedWeak = [...weak].sort((a, b) => getAccuracy(state.wordStats[a.id]) - getAccuracy(state.wordStats[b.id]));
    return pick(sortedWeak.length ? sortedWeak : stageWords, 10);
  }

  if (command === "heal") return pick(strong.length ? strong : stageWords, 10);
  if (command === "power") return pick(weak.length ? weak : stageWords, 10);
  return pick(stageWords, 10);
}
