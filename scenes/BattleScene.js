import { STAGES, selectQuestionSet, wordsForStage } from "../utils/questionSelector.js";
import { recordAnswer, stageStrongWordProgress } from "../utils/wordStats.js";

const ENEMIES = {
  normal: [
    { name: "スライム", hp: 55, art: "🟢" },
    { name: "ゴブリン", hp: 65, art: "👹" },
    { name: "バット", hp: 50, art: "🦇" }
  ],
  boss: [
    { name: "語彙ドラゴン", hp: 130, art: "🐉" }
  ]
};

const COMMANDS = {
  attack: { label: "攻撃", base: 20 },
  heal: { label: "回復", base: 35 },
  power: { label: "強攻撃", base: 35 }
};

const PLAYER_CRIT_RATE = 0.14;
const ENEMY_CRIT_RATE = 0.12;
const CRIT_MULTIPLIER = 2.2;

function moneyByTurns(turns) {
  return Math.max(1, Math.min(15, 16 - turns));
}

function dropItem() {
  const r = Math.random();
  if (r < 0.22) return { name: "パン", type: "heal", value: 22 };
  if (r < 0.33) return { name: "木の盾", type: "guard", value: 0.6 };
  if (r < 0.43) return { name: "増強剤", type: "boost", value: 2 };
  return null;
}

export class BattleScene {
  constructor(root, state, navigate) {
    this.root = root;
    this.state = state;
    this.navigate = navigate;
  }

  render() {
    const progress = stageStrongWordProgress(stageWords, this.state);
    const canFightBoss = progress >= 0.8;
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
        <div class="stage-nav">
          <label for="stage-select">移動先ステージ</label>
          <select id="stage-select">
            ${STAGES.map((s) => `<option value="${s.stage}" ${s.stage === this.state.stage ? "selected" : ""}>${s.stage}</option>`).join("")}
          </select>
          <button id="stage-move-btn">移動</button>
        </div>
        <div class="arena">
          <div class="actor player" id="player-actor">🧑‍🎓</div>
          <div class="actor enemy">
            <div id="enemy-art" class="enemy-sprite">${enemy.art}</div>
            <div id="enemy-name">${enemy.name}</div>
          </div>
          <div class="battle-fx-layer" id="battle-fx-layer"></div>
        </div>
        <div class="log" id="log">敵とエンカウント！ ${enemy.name} が現れた。</div>
        <div class="turn-report" id="turn-report">
          <div id="player-report">プレイヤー行動: -</div>
          <div id="enemy-report">敵行動: -</div>
        </div>
        <div class="actions">
          <div class="progress-note">中ボス挑戦条件: 得意な単語数 / 出題範囲総数 = ${(progress * 100).toFixed(1)}%</div>
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
    this.state.activeEffects ||= {};
    this.state.activeEffects.playerAttackBoostTurns ||= 0;
    this.state.activeEffects.playerGuardTurns ||= 0;
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
    this.root.querySelector("#stage-move-btn").addEventListener("click", () => {
      const selected = Number(this.root.querySelector("#stage-select").value);
      if (selected === this.state.stage) {
        this.writeLog(`STAGE ${selected} にいます。`);
        return;
      }
      this.state.stage = selected;
      this.state.enemyHp = 0;
      this.state.turns = 0;
      this.navigate("battle");
    });
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
      const ok = answer.trim() === String(q.a ?? "").trim();
      recordAnswer(this.state, q.id, ok);
      if (ok) correct += 1;
    }

    const power = COMMANDS[command].base;
    const baseAmount = Math.round(power * (correct / 10));
    const hasBoost = command !== "heal" && this.state.activeEffects.playerAttackBoostTurns > 0;
    if (hasBoost) this.state.activeEffects.playerAttackBoostTurns -= 1;

    const boostedAmount = hasBoost ? baseAmount * 2 : baseAmount;
    const critical = command !== "heal" && Math.random() < PLAYER_CRIT_RATE;
    const amount = critical ? Math.round(boostedAmount * CRIT_MULTIPLIER) : boostedAmount;

    if (command === "heal") {
      const beforeHp = this.state.playerHp;
      this.state.playerHp = Math.min(this.state.maxHp, this.state.playerHp + amount);
      const healed = this.state.playerHp - beforeHp;
      this.writeLog(`${COMMANDS[command].label}: ${correct}/10正解。${healed}回復。`);
      this.updateTurnReport("player", `${COMMANDS[command].label}で${healed}回復`)
      this.playBattleEffect("heal", "player");
    } else {
      this.state.enemyHp = Math.max(0, this.state.enemyHp - amount);
      const critText = critical ? " 会心の一撃！" : "";
      const boostText = hasBoost ? " 増強剤で威力2倍！" : "";
      this.writeLog(`${COMMANDS[command].label}: ${correct}/10正解。${amount}ダメージ。${critText}${boostText}`);
      this.updateTurnReport("player", `${COMMANDS[command].label}で${amount}ダメージ${critical ? "（会心）" : ""}`);
      this.playBattleEffect("attack", "enemy");
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
    const guarded = this.state.activeEffects.playerGuardTurns > 0;
    const base = this.enemy.isBoss ? 20 : 12;
    const boosted = Math.random() < ENEMY_CRIT_RATE;
    const critDamage = boosted ? Math.round(base * CRIT_MULTIPLIER) : base;
    const damage = Math.round(critDamage * (guarded ? 0.6 : 1));
    if (guarded) this.state.activeEffects.playerGuardTurns -= 1;

    this.state.playerHp = Math.max(0, this.state.playerHp - damage);
    this.writeLog(`${this.enemy.name}の攻撃！ ${damage}ダメージ。${boosted ? " 痛恨の一撃！" : ""}${guarded ? " 木の盾で軽減！" : ""}`);
    this.updateTurnReport("enemy", `${this.enemy.name}から${damage}ダメージ${boosted ? "（痛恨）" : ""}`);
    this.playBattleEffect("hit", "player");
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
          <h3>英単語: ${q.word ?? q.q}</h3>
          <p>${q.example ? `例文: ${q.example}` : ""}</p>
          <p>日本語を入力（9秒）</p>
          <input id="ans" autocomplete="off" />
          <div>残り: <span id="timer">9</span>秒</div>
          <button id="submit">決定</button>
          <p id="feedback"></p>
          <button id="next" style="display:none;">次へ</button>
        </div>
      `;
      document.body.appendChild(modal);
      const input = modal.querySelector("#ans");
      const timer = modal.querySelector("#timer");
      const feedback = modal.querySelector("#feedback");
      const nextBtn = modal.querySelector("#next");
      const submitBtn = modal.querySelector("#submit");
      input.focus();

      let remaining = 9;
      let finished = false;
      const close = (value) => {
        if (finished) return;
        finished = true;
        clearInterval(interval);
        modal.remove();
        resolve(value || "");
      };

      const revealAnswer = (value, reason = "submit") => {
        if (finished) return;
        clearInterval(interval);
        const userAnswer = value?.trim() ?? "";
        const correctAnswer = String(q.a ?? "").trim();
        const ok = userAnswer === correctAnswer;
        const isTimeout = reason === "timeout";

        feedback.textContent = ok
          ? `正解！ 正答: ${correctAnswer}`
          : isTimeout
            ? `時間切れ！ 正答: ${correctAnswer}`
            : `不正解！ 正答: ${correctAnswer}`;
        feedback.className = ok ? "feedback success" : "feedback fail";
        this.playQuizEffect(ok ? "success" : "fail", modal.querySelector(".quiz-card"));
        if (isTimeout) timer.textContent = "0";
        submitBtn.style.display = "none";
        input.disabled = true;
        nextBtn.style.display = "inline-block";
        if (reason === "keyboard-submit") {
          setTimeout(() => nextBtn.focus(), 0);
        } else {
          nextBtn.focus();
        }
        nextBtn.onclick = (e) => {
          e.preventDefault();
          close(value);
        };
      };

      const interval = setInterval(() => {
        remaining -= 1;
        timer.textContent = String(remaining);
        if (remaining <= 0) revealAnswer("", "timeout");
      }, 1000);

      modal.querySelector("#submit").addEventListener("click", () => revealAnswer(input.value, "submit"));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          revealAnswer(input.value, "keyboard-submit");
        }
      });
    });
  }

  updateEnemyVisual() {
    this.state.enemyHp = this.enemy.maxHp;
    this.root.querySelector("#enemy-art").textContent = this.enemy.art;
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
          const beforeHp = this.state.playerHp;
          this.state.playerHp = Math.min(this.state.maxHp, this.state.playerHp + item.value);
          const healed = this.state.playerHp - beforeHp;
          this.writeLog(`${item.name}で${healed}回復（ターン消費なし）`);
          this.updateTurnReport("player", `${item.name}で${healed}回復`);
        }
        if (item.type === "guard") {
          this.state.activeEffects.playerGuardTurns = 1;
          this.writeLog(`${item.name}を使用。次の敵攻撃を軽減（ターン消費なし）`);
          this.updateTurnReport("player", `${item.name}で次の被ダメ軽減`);
        }
        if (item.type === "boost") {
          this.state.activeEffects.playerAttackBoostTurns = 1;
          this.writeLog(`${item.name}を使用。次の攻撃ダメージ2倍（ターン消費なし）`);
          this.updateTurnReport("player", `${item.name}で次の攻撃2倍`);
        }
        item.used = true;
        this.updateHud();
        this.renderInventory();
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

  updateTurnReport(side, text) {
    const id = side === "enemy" ? "#enemy-report" : "#player-report";
    const target = this.root.querySelector(id);
    if (target) target.textContent = `${side === "enemy" ? "敵行動" : "プレイヤー行動"}: ${text}`;
  }

  playBattleEffect(type, target) {
    const layer = this.root.querySelector("#battle-fx-layer");
    const targetEl = target === "player"
      ? this.root.querySelector("#player-actor")
      : this.root.querySelector("#enemy-art");
    if (!layer || !targetEl) return;

    targetEl.classList.remove("fx-pulse-hit", "fx-pulse-heal", "fx-pulse-attack");
    void targetEl.offsetWidth;

    const fx = document.createElement("div");
    fx.className = `battle-fx fx-${type} fx-on-${target}`;
    layer.appendChild(fx);
    fx.addEventListener("animationend", () => fx.remove(), { once: true });

    if (type === "hit") targetEl.classList.add("fx-pulse-hit");
    if (type === "heal") targetEl.classList.add("fx-pulse-heal");
    if (type === "attack") targetEl.classList.add("fx-pulse-attack");
  }

  playQuizEffect(type, quizCard) {
    if (!quizCard) return;
    quizCard.classList.remove("quiz-success", "quiz-fail");
    void quizCard.offsetWidth;
    quizCard.classList.add(type === "success" ? "quiz-success" : "quiz-fail");

    const badge = document.createElement("div");
    badge.className = `quiz-fx-badge ${type === "success" ? "quiz-fx-success" : "quiz-fx-fail"}`;
    badge.textContent = type === "success" ? "✓" : "✕";
    quizCard.appendChild(badge);
    badge.addEventListener("animationend", () => badge.remove(), { once: true });
  }
}
