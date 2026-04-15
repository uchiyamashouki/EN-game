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

  async playerTurn(command) {
    if (this.state.playerHp <= 0 || this.state.enemyHp <= 0) return;
    const questions = selectQuestionSet({ command, stage: this.state.stage, state: this.state, isBoss: this.enemy?.isBoss });

    let correct = 0;
    for (const q of questions) {
      const answer = await this.askQuestion(q);
      const ok = answer.trim() === q.a;
      recordAnswer(this.state, q.id, ok);
      if (ok) correct += 1;
    }

    const power = COMMANDS[command].base;
    const amount = Math.round(power * (correct / 10));
    if (command === "heal") {
      this.state.playerHp = Math.min(this.state.maxHp, this.state.playerHp + amount);
      this.writeLog(`${COMMANDS[command].label}: ${correct}/10正解。${amount}回復。`);
    } else {
      this.state.enemyHp = Math.max(0, this.state.enemyHp - amount);
      this.writeLog(`${COMMANDS[command].label}: ${correct}/10正解。${amount}ダメージ。`);
    }
    this.state.turns += 1;
    this.updateHud();

    if (this.state.enemyHp <= 0) {
      const gain = moneyByTurns(this.state.turns);
      this.state.money += gain;
      const item = dropItem();
      if (item) this.state.inventory.push(item);
      this.navigate("result", { win: true, gain, item, boss: this.enemy.isBoss });
      return;
    }

    this.enemyTurn();
  }

  enemyTurn() {
    const guard = this.state.inventory.find((i) => i.type === "guard" && !i.used);
    const base = this.enemy.isBoss ? 20 : 12;
    const damage = Math.round(base * (guard ? guard.value : 1));
    if (guard) guard.used = true;

    this.state.playerHp = Math.max(0, this.state.playerHp - damage);
    this.writeLog(`${this.enemy.name}の攻撃！ ${damage}ダメージ。`);
    this.updateHud();

    if (this.state.playerHp <= 0) {
      this.state.money = Math.floor(this.state.money / 2);
      this.navigate("result", { win: false, loseMoney: true });
    }
  }

  askQuestion(q) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "quiz-modal";
      modal.innerHTML = `
        <div class="quiz-card">
          <h3>${q.q}</h3>
          <p>日本語を入力（6秒）</p>
          <input id="ans" autocomplete="off" />
          <div>残り: <span id="timer">6</span>秒</div>
          <button id="submit">決定</button>
        </div>
      `;
      document.body.appendChild(modal);
      const input = modal.querySelector("#ans");
      const timer = modal.querySelector("#timer");
      input.focus();

      let remaining = 6;
      const done = (value) => {
        clearInterval(interval);
        modal.remove();
        resolve(value || "");
      };

      const interval = setInterval(() => {
        remaining -= 1;
        timer.textContent = String(remaining);
        if (remaining <= 0) done("");
      }, 1000);

      modal.querySelector("#submit").addEventListener("click", () => done(input.value));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") done(input.value);
      });
    });
  }

  updateEnemyVisual() {
    this.state.enemyHp = this.enemy.maxHp;
    this.root.querySelector("#enemy-art").src = this.enemy.art;
    this.root.querySelector("#enemy-name").textContent = this.enemy.name;
    this.updateHud();
  }

  renderInventory() {
    const box = this.root.querySelector("#inventory");
    const items = this.state.inventory.filter((i) => !i.used);
    box.innerHTML = `<h4>ドロップアイテム</h4>${items.length ? "" : "なし"}`;
    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.textContent = `${item.name}を使う`;
      btn.addEventListener("click", () => {
        if (item.type === "heal") {
          this.state.playerHp = Math.min(this.state.maxHp, this.state.playerHp + item.value);
          item.used = true;
          this.writeLog(`${item.name}で${item.value}回復（ターン消費なし）`);
          this.updateHud();
          this.renderInventory();
        }
      });
      box.appendChild(btn);
    });
  }

  updateHud() {
    this.root.querySelector("#player-hp").textContent = `${this.state.playerHp}/${this.state.maxHp}`;
    this.root.querySelector("#enemy-hp").textContent = `${this.state.enemyHp ?? this.enemy.maxHp}/${this.enemy.maxHp}`;
  }

  writeLog(text) {
    this.root.querySelector("#log").textContent = text;
  }
}
  }
