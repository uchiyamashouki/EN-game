// utils/questionSelector.js

// ステージ情報を読み込む
import { STAGES } from "../data/stages.js";

/**
 * ステージ範囲を取得
 */
export function getStageRange(stage) {
  return STAGES.find(s => s.stage === stage);
}

/**
 * ステージに応じた単語抽出
 */
export function filterWordsByStage(words, stage) {
  const range = getStageRange(stage);

  if (!range) return [];

  return words.filter(word => {
    return word.id >= range.startId && word.id <= range.endId;
  });
}
