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

const seedWords = [
  ["apple", "りんご"], ["run", "走る"], ["book", "本"], ["river", "川"], ["build", "建てる"],
  ["bright", "明るい"], ["honest", "正直な"], ["practice", "練習する"], ["future", "未来"], ["journey", "旅"],
  ["create", "創る"], ["result", "結果"], ["challenge", "挑戦"], ["market", "市場"], ["energy", "エネルギー"],
  ["focus", "集中する"], ["memory", "記憶"], ["culture", "文化"], ["repair", "修理する"], ["borrow", "借りる"],
  ["deliver", "届ける"], ["speech", "演説"], ["observe", "観察する"], ["correct", "正しい"], ["improve", "改善する"]
];

function createWord(id) {
  const [en, ja] = seedWords[(id - 1) % seedWords.length];
  return { id, q: `${en} #${id}`, a: `${ja}${id}` };
}

const WORDS = Array.from({ length: 1477 }, (_, i) => createWord(i + 1));

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
  if (!pool.length) {
    return Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  const list = shuffle(pool);
  const out = [];
  while (out.length < count) out.push(list[out.length % list.length]);
  return out;
}

export function selectQuestionSet({ command, stage, state, isBoss = false }) {
  const stageWords = wordsForStage(stage);
  const { strong, weak, unseen } = classifyWords(stageWords, state);

  if (isBoss) {
    const prioritized = [...weak].sort((a, b) => a.accuracy - b.accuracy);
    return pick(prioritized.length ? prioritized : stageWords, 10);
  }

  if (command === "heal") return pick(strong.length ? strong : stageWords, 10);
  if (command === "power") {
    const fallback = unseen.length ? unseen : stageWords;
    return pick(weak.length ? weak : fallback, 10);
  }
  
    return pick(stageWords, 10);
}
