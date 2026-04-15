import { filterWordsByStage } from "../systems/questionSelector.js";
import { WORDS } from "../data/words.js";
import { gameState } from "../state/gameState.js";

// ステージに応じた単語を取得
const stageWords = filterWordsByStage(WORDS, gameState.stage);
