export function initWordStat(state, wordId) {
  if (!state.wordStats[wordId]) {
    state.wordStats[wordId] = { correct: 0, total: 0 };
  }
  return state.wordStats[wordId];
}

export function recordAnswer(state, wordId, isCorrect) {
  const stat = initWordStat(state, wordId);
  stat.total += 1;
  if (isCorrect) stat.correct += 1;
}

export function getAccuracy(stat) {
  if (!stat || stat.total === 0) return 0;
  return stat.correct / stat.total;
}

export function classifyWords(words, state) {
  const strong = [];
  const weak = [];
  const unseen = [];

  for (const word of words) {
    const stat = state.wordStats[word.id];
    if (!stat || stat.total === 0) {
      unseen.push({ ...word, accuracy: 0 });
      continue;
    }
    
    const acc = getAccuracy(stat);
    if (acc >= 0.6) strong.push({ ...word, accuracy: acc });
    else weak.push({ ...word, accuracy: acc });
  }

  return { strong, weak, unseen };
}

export function stageCoverage(stageWords, state) {
  const solved = stageWords.filter((w) => (state.wordStats[w.id]?.correct || 0) > 0).length;
  return stageWords.length ? solved / stageWords.length : 0;
}

export function stageStrongWordProgress(stageWords, state) {
  if (!stageWords.length) return 0;
  const strongCount = stageWords.filter((word) => {
    const stat = state.wordStats[word.id];
    return stat && stat.total > 0 && getAccuracy(stat) >= 0.6;
  }).length;
  return strongCount / stageWords.length;
}
