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

export function getWordAccuracy(state, wordId) {
  return getAccuracy(state.wordStats[wordId]);
}

export function classifyWords(words, state) {
  const strong = [];
  const weak = [];

  for (const word of words) {
    const stat = state.wordStats[word.id];
    const acc = getAccuracy(stat);
    if (!stat || stat.total === 0 || acc < 0.6) {
      weak.push({ ...word, accuracy: acc });
    } else {
      strong.push({ ...word, accuracy: acc });
    }
  }

  return { strong, weak };
}

export function stageCoverage(stageWords, state) {
  const solved = stageWords.filter((w) => (state.wordStats[w.id]?.correct || 0) > 0).length;
  return stageWords.length ? solved / stageWords.length : 0;
}
