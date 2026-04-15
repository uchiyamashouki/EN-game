// 修正前（NG）
import { filterWordsByStage } from "../systems/questionSelector.js";
import { gameState } from "../state/gameState.js";

// 修正後（OK）
import { filterWordsByStage } from "../utils/questionSelector.js";
import { gameState } from "../gameState.js";
