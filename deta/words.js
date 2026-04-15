const seedWords = [
  ["apple", "りんご"], ["run", "走る"], ["book", "本"], ["river", "川"], ["build", "建てる"],
  ["bright", "明るい"], ["honest", "正直な"], ["practice", "練習する"], ["future", "未来"], ["journey", "旅"],
  ["create", "創る"], ["result", "結果"], ["challenge", "挑戦"], ["market", "市場"], ["energy", "エネルギー"],
  ["focus", "集中する"], ["memory", "記憶"], ["culture", "文化"], ["repair", "修理する"], ["borrow", "借りる"],
  ["deliver", "届ける"], ["speech", "演説"], ["observe", "観察する"], ["correct", "正しい"], ["improve", "改善する"]
];

function createWord(id) {
  const [en, ja] = seedWords[(id - 1) % seedWords.length];
  return {
    id,
    q: `${en} #${id}`,
    a: `${ja}${id}`
  };
}

export const WORDS = Array.from({ length: 1477 }, (_, i) => createWord(i + 1));
