// 各面の出題単語の範囲
// idベースで管理する（←ここ重要）
export const STAGES = [
  { stage: 1, startId: 1, endId: 200 },
  { stage: 2, startId: 201, endId: 400 },
  { stage: 3, startId: 401, endId: 600 },
  { stage: 4, startId: 601, endId: 800 },
  { stage: 5, startId: 801, endId: 1000 },
  { stage: 6, startId: 1001, endId: 1200 },
  { stage: 7, startId: 1201, endId: 1477 },

  // 最終ステージ（総復習）
  { stage: 8, startId: 1, endId: 1477 }
];
