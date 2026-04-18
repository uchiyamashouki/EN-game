export const ICON_TYPES = {
  player: "プレイヤー",
  goblin: "ゴブリン",
  bat: "バット",
  slime: "スライム",
  ghost: "オバケ",
  dragon: "語彙ドラゴン"
};

// NOTE:
// 外部フリー素材を使用する場合は emoji を null にして src に画像URLを設定してください。
// 例: { id: "player_1", type: "player", name: "プレイヤー1", emoji: null, src: "https://..." }
export const ICON_POOL = [
  { id: "player_1", type: "player", name: "プレイヤー1", emoji: "🧑‍🎓", src: null },
  { id: "player_2", type: "player", name: "プレイヤー2", emoji: "🧙", src: null },
  { id: "player_3", type: "player", name: "プレイヤー3", emoji: "🧑‍🚀", src: null },
  { id: "player_4", type: "player", name: "プレイヤー4", emoji: "🧑‍🍳", src: null },
  { id: "player_5", type: "player", name: "プレイヤー5", emoji: "🧑‍💻", src: null },

  { id: "goblin_1", type: "goblin", name: "ゴブリン1", emoji: "👹", src: null },
  { id: "goblin_2", type: "goblin", name: "ゴブリン2", emoji: "👺", src: null },
  { id: "goblin_3", type: "goblin", name: "ゴブリン3", emoji: "🤺", src: null },
  { id: "goblin_4", type: "goblin", name: "ゴブリン4", emoji: "🗡️", src: null },
  { id: "goblin_5", type: "goblin", name: "ゴブリン5", emoji: "🪓", src: null },

  { id: "bat_1", type: "bat", name: "バット1", emoji: "🦇", src: null },
  { id: "bat_2", type: "bat", name: "バット2", emoji: "🕸️", src: null },
  { id: "bat_3", type: "bat", name: "バット3", emoji: "🌙", src: null },
  { id: "bat_4", type: "bat", name: "バット4", emoji: "🌑", src: null },
  { id: "bat_5", type: "bat", name: "バット5", emoji: "🪽", src: null },

  { id: "slime_1", type: "slime", name: "スライム1", emoji: "🟢", src: null },
  { id: "slime_2", type: "slime", name: "スライム2", emoji: "🫧", src: null },
  { id: "slime_3", type: "slime", name: "スライム3", emoji: "💧", src: null },
  { id: "slime_4", type: "slime", name: "スライム4", emoji: "🧪", src: null },
  { id: "slime_5", type: "slime", name: "スライム5", emoji: "🟩", src: null },

  { id: "ghost_1", type: "ghost", name: "オバケ1", emoji: "👻", src: null },
  { id: "ghost_2", type: "ghost", name: "オバケ2", emoji: "💀", src: null },
  { id: "ghost_3", type: "ghost", name: "オバケ3", emoji: "☠️", src: null },
  { id: "ghost_4", type: "ghost", name: "オバケ4", emoji: "🕯️", src: null },
  { id: "ghost_5", type: "ghost", name: "オバケ5", emoji: "🌫️", src: null },

  { id: "dragon_1", type: "dragon", name: "語彙ドラゴン1", emoji: "🐉", src: null },
  { id: "dragon_2", type: "dragon", name: "語彙ドラゴン2", emoji: "🐲", src: null },
  { id: "dragon_3", type: "dragon", name: "語彙ドラゴン3", emoji: "🔥", src: null },
  { id: "dragon_4", type: "dragon", name: "語彙ドラゴン4", emoji: "⚡", src: null },
  { id: "dragon_5", type: "dragon", name: "語彙ドラゴン5", emoji: "🌋", src: null }
];

export const DEFAULT_SELECTED_ICONS = {
  player: "player_1",
  goblin: "goblin_1",
  bat: "bat_1",
  slime: "slime_1",
  ghost: "ghost_1",
  dragon: "dragon_1"
};

export const DEFAULT_UNLOCKED_ICON_IDS = Object.values(DEFAULT_SELECTED_ICONS);

export const GACHA_RARE_RATE = 0.03;
