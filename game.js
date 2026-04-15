class BattleScene extends Phaser.Scene {
  constructor() {
    super("BattleScene");
    this.currentQuestion = 0;
    this.correctCount = 0;
    this.questions = [
      { word: "apple", answer: "りんご" },
      { word: "book", answer: "本" },
      { word: "dog", answer: "犬" },
      { word: "water", answer: "水" },
      { word: "run", answer: "走る" }
    ];
  }

  create() {
    this.cameras.main.setBackgroundColor("#1e1e2f");

    this.enemyHP = 100;
    this.playerMoney = 0;
    this.winStreak = 0;

    this.titleText = this.add.text(20, 20, "英単語RPG バトル", {
      fontSize: "28px",
      color: "#ffffff"
    });

    this.enemyText = this.add.text(20, 70, `敵HP: ${this.enemyHP}`, {
      fontSize: "24px",
      color: "#ff8080"
    });

    this.infoText = this.add.text(20, 120, "", {
      fontSize: "24px",
      color: "#ffffff",
      wordWrap: { width: 760 }
    });

    this.inputBox = this.add.dom(220, 260, "input", {
      width: "300px",
      fontSize: "24px",
      padding: "8px"
    });

    this.answerButton = this.add.text(540, 245, "[回答]", {
      fontSize: "28px",
      backgroundColor: "#2e8b57",
      padding: { x: 16, y: 10 }
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => this.checkAnswer());

    this.resultText = this.add.text(20, 330, "", {
      fontSize: "22px",
      color: "#ffff99",
      wordWrap: { width: 760 }
    });

    this.startQuiz();
  }

  startQuiz() {
    this.currentQuestion = 0;
    this.correctCount = 0;
    this.resultText.setText("");
    this.showQuestion();
  }

  showQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.finishBattleTurn();
      return;
    }

    const q = this.questions[this.currentQuestion];
    this.infoText.setText(
      `問題 ${this.currentQuestion + 1} / ${this.questions.length}\n` +
      `「${q.word}」の意味を日本語で入力`
    );

    this.inputBox.node.value = "";
    this.inputBox.node.focus();
  }

  checkAnswer() {
    const q = this.questions[this.currentQuestion];
    const userAnswer = this.inputBox.node.value.trim();

    if (userAnswer === q.answer) {
      this.correctCount++;
      this.resultText.setText(`正解！ (${this.correctCount}問正解中)`);
    } else {
      this.resultText.setText(`不正解… 正解は「${q.answer}」`);
    }

    this.currentQuestion++;
    this.time.delayedCall(700, () => this.showQuestion());
  }

  finishBattleTurn() {
    const damage = this.correctCount * 12;
    this.enemyHP = Math.max(0, this.enemyHP - damage);

    let text = `今回の正解数: ${this.correctCount}\n`;
    text += `敵に ${damage} ダメージ！\n`;

    if (this.enemyHP <= 0) {
      const reward = 100 + this.winStreak * 30;
      this.playerMoney += reward;
      this.winStreak++;
      text += `敵を倒した！ 食費 ${reward} 円を獲得！\n`;
      text += `現在の食費: ${this.playerMoney} 円\n`;
      text += `連勝数: ${this.winStreak}\n`;

      this.enemyHP = 100;
    } else {
      const lost = Math.floor(this.playerMoney / 2);
      this.playerMoney -= lost;
      this.winStreak = 0;
      text += `敵を倒せなかった… 食費を ${lost} 円失った\n`;
      text += `現在の食費: ${this.playerMoney} 円\n`;
    }

    this.enemyText.setText(`敵HP: ${this.enemyHP}`);
    this.infoText.setText(text);

    this.add.text(20, 500, "[次の戦闘へ]", {
      fontSize: "28px",
      backgroundColor: "#4444aa",
      padding: { x: 16, y: 10 }
    })
    .setInteractive({ useHandCursor: true })
    .once("pointerdown", (button) => {
      button.destroy();
      this.startQuiz();
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#000000",
  dom: {
    createContainer: true
  },
  scene: [BattleScene]
};

new Phaser.Game(config);
