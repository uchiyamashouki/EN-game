// ゲーム全体で使うデータをまとめる
export const gameState = {
  stage: 1,          // 今いる面
  money: 0,          // 食費
  playerHp: 100,     // プレイヤーHP
  maxPlayerHp: 100,
  turnCount: 0,      // 戦闘ターン数

  // 単語ごとの学習記録
  wordStats: {
    // apple: { correct: 3, total: 5 }
  },

  inventory: [],     // アイテム一覧
  equipment: {
    weapon: null,
    armor: null
  }
};
