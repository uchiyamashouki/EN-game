// 単語の正答率を計算する関数
export function getAccuracy(stat) {
  if (!stat || stat.total === 0) return 0;
  return stat.correct / stat.total;
}

// 配列からランダムに1つ選ぶ関数
export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
