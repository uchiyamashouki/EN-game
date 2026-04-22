import { classifyWords } from "./wordStats.js";
import { WORDS } from "../deta/words.js";
import { STAGES } from "../state/stages.js";

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

function fillQuestionsFromPool(pool, count = 10, options = {}) {
  const { shuffleEachCycle = true } = options;
  if (!pool.length) {
    return Array.from({ length: count }, () => randomWord());
  }
  
  const out = [];

  while (out.length < count) {
    const cycle = shuffleEachCycle ? shuffle(pool) : [...pool];
    for (const word of cycle) {
      if (out.length >= count) break;
      out.push(word);
    }
  }

  return out;
}

function pick(pool, count = 10) {
  return fillQuestionsFromPool(pool, count);
}

function pickPrioritizedByAnswerCount(pool, state, count = 10, options = {}) {
  const { unseenFirst = false } = options;
  if (!pool.length) {
    return Array.from({ length: count }, () => randomWord());
  }

  const stats = state?.wordStats ?? {};
  const prioritizedMeta = [...pool]
    .map((word) => {
      const total = stats[word.id]?.total ?? 0;
      return {
        word,
        total,
        unseenRank: total === 0 ? 0 : 1,
        tie: Math.random()
      };
    })
    .sort((a, b) => {
      if (unseenFirst) {
        return (a.unseenRank - b.unseenRank) || (a.total - b.total) || (a.tie - b.tie);
      }
      return (a.total - b.total) || (a.tie - b.tie);
    });

  const grouped = new Map();
  for (const entry of prioritizedMeta) {
    const rank = unseenFirst ? `${entry.unseenRank}:${entry.total}` : String(entry.total);
    const current = grouped.get(rank) ?? [];
    current.push(entry.word);
    grouped.set(rank, current);
  }

  const cycles = [];
  for (const key of grouped.keys()) {
    const words = grouped.get(key) ?? [];
    cycles.push(shuffle(words));
  }

  const prioritized = cycles.flat();
  return fillQuestionsFromPool(prioritized, count, { shuffleEachCycle: false });
}

export function selectQuestionSet({ command, stage, state, isBoss = false }) {
  const stageWords = wordsForStage(stage);
  const { strong, weak, unseen } = classifyWords(stageWords, state);
  
  if (isBoss) {
    const prioritized = [...weak].sort((a, b) => a.accuracy - b.accuracy);
    return pick(prioritized.length ? prioritized : stageWords, 10);
  }

  if (command === "heal") {
    return pickPrioritizedByAnswerCount(strong.length ? strong : stageWords, state, 10);
  }
  if (command === "power") {
    const fallback = unseen.length ? unseen : stageWords;
    return pickPrioritizedByAnswerCount(weak.length ? weak : fallback, state, 10);
  }
  
  if (command === "attack") {
    return pickPrioritizedByAnswerCount(stageWords, state, 10, { unseenFirst: true });
  }

  return pick(stageWords, 10);
}
