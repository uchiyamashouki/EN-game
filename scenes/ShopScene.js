import { runGacha, ensureIconState } from "../utils/iconCollection.js";
import { ICON_POOL } from "../deta/icons.js";

export class ShopScene {
  constructor(root, state, navigate) {
    this.root = root;
    this.state = state;
    this.navigate = navigate;
  }

  render() {
    ensureIconState(this.state);
    const unlockedCount = this.state.unlockedIconIds.length;
    const gachaLog = this.state.lastGachaResult?.length
      ? this.state.lastGachaResult.map((r, idx) => r.won ? `${idx + 1}回目: ${r.icon.name}` : `${idx + 1}回目: はずれ`).join("<br>")
      : "まだガチャを引いていません。";

    this.root.innerHTML = `
      <div class="panel">
        <h2>ショップ</h2>
        <p>所持金: ${this.state.money}円</p>
        <button data-item="heal" data-cost="8">パン(8円) HP+25</button>
        <button data-item="guard" data-cost="10">木の盾(10円) 被ダメ軽減</button>
        <button data-item="boost" data-cost="12">増強剤(12円) 次の攻撃ダメージ2倍</button>
        <hr />
        <h3>アイコンガチャ（排出率3%）</h3>
        <p>入手済み: ${unlockedCount} / 36</p>
        <button data-gacha="1" data-cost="10">1回ガチャ(10円)</button>
        <button data-gacha="10" data-cost="100">10連ガチャ(100円)</button>
        <div class="gacha-log">${gachaLog}</div>
        <button id="back">戻る</button>
      </div>
    `;

    this.root.querySelectorAll("[data-item]").forEach((b) => {
      b.addEventListener("click", () => {
        const cost = Number(b.dataset.cost);
        if (this.state.money < cost) return;
        this.state.money -= cost;
        if (b.dataset.item === "heal") this.state.inventory.push({ name: "パン", type: "heal", value: 25 });
        if (b.dataset.item === "guard") this.state.inventory.push({ name: "木の盾", type: "guard", value: 0.6 });
        if (b.dataset.item === "boost") this.state.inventory.push({ name: "増強剤", type: "boost", value: 2 });
        this.render();
      });
    });

    this.root.querySelectorAll("[data-gacha]").forEach((b) => {
      b.addEventListener("click", () => {
        const count = Number(b.dataset.gacha);
        const cost = Number(b.dataset.cost);
        if (this.state.money < cost) return;

        this.state.money -= cost;
        this.state.lastGachaResult = runGacha(this.state, count);
        this.render();
      });
    });

    this.root.querySelector("#back").addEventListener("click", () => this.navigate("battle"));
  }
}
