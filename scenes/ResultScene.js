import { wordsForStage } from "../utils/questionSelector.js";
import { stageStrongWordProgress } from "../utils/wordStats.js";

export class ResultScene {
  constructor(root, state, navigate, payload) {
    this.root = root;
    this.state = state;
    this.navigate = navigate;
    this.payload = payload;
  }

  render() {
    const p = this.payload || {};
    const progress = stageStrongWordProgress(wordsForStage(this.state.stage), this.state);
    const bossCleared = p.win && p.boss;

    if (bossCleared && this.state.stage < 8) this.state.stage += 1;

    this.root.innerHTML = `
      <div class="panel">
        <h2>${p.win ? "勝利！" : "敗北..."}</h2>
        <p>${p.win ? `食費を ${p.gain}円 獲得。` : "所持金が半分になった。"}</p>
        <p>${p.item ? `ドロップ: ${p.item.name}` : "ドロップなし"}</p>
        <p>現在ステージ: ${this.state.stage}</p>
        <p>中ボス挑戦条件進捗（得意な単語数 / 出題範囲総数）: ${(progress * 100).toFixed(1)}%</p>
        <button id="back">次へ</button>
      </div>
    `;

    this.root.querySelector("#back").addEventListener("click", () => {
      this.state.enemyHp = 0;
      this.state.turns = 0;
      this.navigate("battle");
    });
  }
}
