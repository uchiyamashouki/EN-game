import { BattleScene } from "./scenes/BattleScene.js";
import { ResultScene } from "./scenes/ResultScene.js";
import { ShopScene } from "./scenes/ShopScene.js";
import { NpcScene } from "./scenes/NpcScene.js";
import { loadGame, saveGame } from "./systems/saveData.js";
import { DEFAULT_SELECTED_ICONS, DEFAULT_UNLOCKED_ICON_IDS } from "./deta/icons.js";
import { ensureIconState } from "./utils/iconCollection.js";

const app = document.querySelector("#app");

const initialState = {
  stage: 1,
  money: 0,
  maxHp: 100,
  playerHp: 100,
  enemyHp: 60,
  turns: 0,
  wordStats: {},
  inventory: [],
  unlockedIconIds: [...DEFAULT_UNLOCKED_ICON_IDS],
  selectedIcons: { ...DEFAULT_SELECTED_ICONS }
};

const state = { ...initialState, ...(loadGame() ?? {}) };
ensureIconState(state);

function navigate(name, payload = {}) {
  saveGame(state);
  if (name === "battle") {
    if (state.enemyHp <= 0) state.enemyHp = 60 + (state.stage - 1) * 5;
    new BattleScene(app, state, navigate).render();
  }
  if (name === "result") new ResultScene(app, state, navigate, payload).render();
  if (name === "shop") new ShopScene(app, state, navigate).render();
  if (name === "npc") new NpcScene(app, state, navigate).render();
}

window.addEventListener("beforeunload", () => saveGame(state));
setInterval(() => saveGame(state), 15000);

navigate("battle");
