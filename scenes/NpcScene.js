import { wordsForStage } from "../utils/questionSelector.js";
import { classifyWords } from "../utils/wordStats.js";

export class NpcScene {
  constructor(root, state, navigate) {
    this.root = root;
    this.state = state;
    this.navigate = navigate;
  }

  render() {
    const stageWords = wordsForStage(this.state.stage);
    const { strong, weak } = classifyWords(stageWords, this.state);

    this.root.innerHTML = `
      <div class="panel">
        <h2>NPC 学習アドバイザー</h2>
        <p>見たい項目を選んでください。</p>
        <div class="actions">
          <button data-kind="strong">得意な単語</button>
          <button data-kind="weak">苦手な単語</button>
          <button data-kind="rate">各問題の正答率</button>
        </div>
        <div id="list"></div>
        <button id="back">戻る</button>
      </div>
    `;

    const list = this.root.querySelector("#list");
    this.root.querySelectorAll("[data-kind]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.kind === "strong") {
          list.innerHTML = `<h3>得意(60%以上)</h3><ul>${strong.slice(0, 40).map((w) => `<li>${w.q}</li>`).join("")}</ul>`;
        } else if (btn.dataset.kind === "weak") {
          list.innerHTML = `<h3>苦手(60%未満)</h3><ul>${weak.slice(0, 40).map((w) => `<li>${w.q}</li>`).join("")}</ul>`;
        } else {
          list.innerHTML = `<h3>正答率</h3><ul>${stageWords.slice(0, 40).map((w) => {
            const s = this.state.wordStats[w.id];
            const rate = s && s.total ? ((s.correct / s.total) * 100).toFixed(1) : "0.0";
            return `<li>${w.q}: ${rate}% (${s?.correct || 0}/${s?.total || 0})</li>`;
          }).join("")}</ul>`;
        }
      });
    });

    this.root.querySelector("#back").addEventListener("click", () => this.navigate("battle"));
  }
}
