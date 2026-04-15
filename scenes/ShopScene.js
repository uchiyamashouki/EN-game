export class ShopScene {
  constructor(root, state, navigate) {
    this.root = root;
    this.state = state;
    this.navigate = navigate;
  }

  render() {
    this.root.innerHTML = `
      <div class="panel">
        <h2>ショップ</h2>
        <p>所持金: ${this.state.money}円</p>
        <button data-item="heal" data-cost="8">パン(8円) HP+25</button>
        <button data-item="guard" data-cost="10">木の盾(10円) 被ダメ軽減</button>
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
        this.render();
      });
    });

    this.root.querySelector("#back").addEventListener("click", () => this.navigate("battle"));
  }
}
