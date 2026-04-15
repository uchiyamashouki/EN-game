import { ENEMIES } from "../data/enemies.js";
import { selectQuestionSet, wordsForStage } from "../utils/questionSelector.js";
import { recordAnswer, stageCoverage } from "../utils/wordStats.js";

const COMMANDS = {
  attack: { label: "攻撃", base: 12 },
  heal: { label: "回復", base: 26 },
  power: { label: "強攻撃", base: 20 }
};

function moneyByTurns(turns) {
  return Math.max(1, Math.min(15, 16 - turns));
}

function dropItem() {
  const r = Math.random();
  if (r < 0.22) return { name: "パン", type: "heal", value: 22 };
  if (r < 0.33) return { name: "木の盾", type: "guard", value: 0.6 };
  return null;
}

export class BattleScene {
  constructor(root, state, navigate) {
    this.root = root;
    this.state = state;
    this.navigate = navigate;
  }

  render() {
    const stageWords = wordsForStage(this.state.stage);
    const coverage = stageCoverage(stageWords, this.state);
    const canFightBoss = coverage >= 0.8;
    const enemy = this.createEnemy(false);

    this.root.innerHTML = `
      <div class="panel battle">
        <div class="hud">
          <div>STAGE ${this.state.stage}</div>
          <div>食費: ${this.state.money}円</div>
          <div>HP: <span id="player-hp"></span></div>
          <div>敵HP: <span id="enemy-hp"></span></div>
        </div>
        <div class="arena">
          <div class="actor player">🧑‍🎓</div>
          <div class="actor enemy">
            <img id="enemy-art" class="enemy-sprite" alt="enemy sprite" src="${enemy.art}" />
            <div id="enemy-name">${enemy.name}</div>
          </div>
        </div>
        <div class="log" id="log">敵とエンカウント！ ${enemy.name} が現れた。</div>
        <div class="actions">
          <button data-cmd="attack">攻撃</button>
          <button data-cmd="heal">回復</button>
          <button data-cmd="power">強攻撃</button>
          <button id="boss-btn" ${canFightBoss ? "" : "disabled"}>中ボス挑戦</button>
          <button id="npc-btn">NPCに相談</button>
          <button id="shop-btn">ショップ</button>
        </div>
        <div class="inventory" id="inventory"></div>
      </div>
    `;

    this.enemy = enemy;
    this.updateHud();
    this.renderInventory();

    this.root.querySelectorAll("[data-cmd]").forEach((btn) => {
      btn.addEventListener("click", () => this.playerTurn(btn.dataset.cmd));
    });
    this.root.querySelector("#boss-btn").addEventListener("click", () => {
      if (!canFightBoss) return;
      this.enemy = this.createEnemy(true);
      this.state.turns = 0;
      this.state.enemyHp = this.enemy.maxHp;
      this.updateEnemyVisual();
      this.writeLog(`中ボス ${this.enemy.name} に挑戦！ 苦手単語が優先出題されます。`);
    });
    this.root.querySelector("#npc-btn").addEventListener("click", () => this.navigate("npc"));
    this.root.querySelector("#shop-btn").addEventListener("click", () => this.navigate("shop"));
  }

  createEnemy(isBoss) {
    const list = isBoss ? ENEMIES.boss : ENEMIES.normal;
    const pick = list[Math.floor(Math.random() * list.length)];
    return { ...pick, maxHp: pick.hp + (this.state.stage - 1) * 5, isBoss };
  }
