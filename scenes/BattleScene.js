import { filterWordsByStage } from "../utils/questionSelector.js";
import { WORDS } from "../data/words.js";
import { gameState } from "../gameState.js";import { filterWordsByStage } from "../utils/questionSelector.js";
import { gameState } from "../gameState.js";

// 今のステージの単語だけ取得
const stageWords = filterWordsByStage(WORDS, gameState.stage);

// デバッグ表示（確認用）
console.log("現在のステージ単語", stageWords);
