export function askWordQuestion(q, playQuizEffect) {
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
      playQuizEffect(ok ? "success" : "fail", modal.querySelector(".quiz-card"));
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

    submitBtn.addEventListener("click", () => revealAnswer(input.value, "submit"));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        revealAnswer(input.value, "keyboard-submit");
      }
    });
  });
}
