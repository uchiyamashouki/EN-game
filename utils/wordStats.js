// 単語の正答率まわりの処理をまとめるファイル

/**
 * 1単語の正答率を計算する
 * 例:
 * stat = { correct: 3, total: 5 } → 0.6
 */
export function getAccuracy(stat) {
  // まだ1回も出題していない場合は 0 とする
  if (!stat || stat.total === 0) {
    return 0;
  }

  return stat.correct / stat.total;
}

/**
 * 単語IDから、その単語の学習データを取得する
 * gameState.wordStats の中にデータがなければ初期値を返す
 */
export function getWordStat(gameState, wordId) {
  return gameState.wordStats[wordId] || { correct: 0, total: 0 };
}

/**
 * 単語一覧を「得意」「苦手」「未学習」に分類する
 *
 * 基準:
 * - 得意単語 = 正答率 60%以上
 * - 苦手単語 = 正答率 60%未満
 * - 未学習   = まだ1回も出題していない
 */
export function classifyWordsByAccuracy(words, gameState) {
  const strongWords = [];   // 得意単語
  const weakWords = [];     // 苦手単語
  const unseenWords = [];   // 未学習単語

  for (const word of words) {
    const stat = getWordStat(gameState, word.id);

    // まだ出題していない単語
    if (stat.total === 0) {
      unseenWords.push(word);
      continue;
    }

    const accuracy = getAccuracy(stat);

    if (accuracy >= 0.6) {
      strongWords.push(word);
    } else {
      weakWords.push(word);
    }
  }

  return {
    strongWords,
    weakWords,
    unseenWords
  };
}
