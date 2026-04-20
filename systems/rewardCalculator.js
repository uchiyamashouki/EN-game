export function moneyByTurns(turns) {
  return Math.max(1, Math.min(15, 16 - turns));
}

export function rewardMultiplier(enemy) {
  if (enemy?.iconType === "ghost") return 3;
  if (enemy?.iconType === "dragon") return 4;
  return 1;
}

export function dropItem() {
  const r = Math.random();
  if (r < 0.22) return { name: "パン", type: "heal", value: 22 };
  if (r < 0.33) return { name: "木の盾", type: "guard", value: 0.6 };
  if (r < 0.43) return { name: "増強剤", type: "boost", value: 2 };
  return null;
}
