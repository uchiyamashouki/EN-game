// ステージデータを読み込む
import { STAGES } from "../data/stages.js";

/**
 * 指定したステージの範囲を取得する
 */
export function getStageRange(stage) {
  return STAGES.find(s => s.stage === stage);
}

/**
 * ステージに応じた単語だけを抽出する
 */
export function filterWordsByStage(words, stage) {
  const range = getStageRange(stage);

  // 範囲外なら空配列
  if (!range) return [];

  return words.filter(word => {
    return word.id >= range.startId && word.id <= range.endId;
  });
}
