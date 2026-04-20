export const ENEMIES = {
  normal: [
    { name: "スライム", hp: 55, art: "🟢", iconType: "slime" },
    { name: "ゴブリン", hp: 65, art: "👹", iconType: "goblin" },
    { name: "バット", hp: 50, art: "🦇", iconType: "bat" }
  ],
  rare: { name: "ゴースト", hp: 60, art: "👻", attack: 50, iconType: "ghost" },
  boss: [
    { name: "語彙ドラゴン", hp: 130, art: "🐉", iconType: "dragon" }
  ]
};

export const COMMANDS = {
  attack: { label: "攻撃", base: 20 },
  heal: { label: "回復", base: 35 },
  power: { label: "強攻撃", base: 35 }
};

export const PLAYER_CRIT_RATE = 0.14;
export const ENEMY_CRIT_RATE = 0.12;
export const CRIT_MULTIPLIER = 2.2;
