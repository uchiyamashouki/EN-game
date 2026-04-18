export const ICON_TYPES = {
  player: "プレイヤー",
  goblin: "ゴブリン",
  bat: "バット",
  slime: "スライム",
  ghost: "オバケ",
  dragon: "語彙ドラゴン"
};

// NOTE:
// 追加アイコンはPNG素材を想定しています（src は *.png を指定）。
// 例: { id: "player_png_1", type: "player", name: "プレイヤー追加1", emoji: null, src: "assets/icons/player_1.png" }
export const ICON_POOL = [
  // ---- 初期開放（絵文字）: 各キャラクター1個 ----
  { id: "player_base", type: "player", name: "プレイヤー(初期)", emoji: "🧑‍🎓", src: null, isBase: true },
  { id: "goblin_base", type: "goblin", name: "ゴブリン(初期)", emoji: "👹", src: null, isBase: true },
  { id: "bat_base", type: "bat", name: "バット(初期)", emoji: "🦇", src: null, isBase: true },
  { id: "slime_base", type: "slime", name: "スライム(初期)", emoji: "🟢", src: null, isBase: true },
  { id: "ghost_base", type: "ghost", name: "オバケ(初期)", emoji: "👻", src: null, isBase: true },
  { id: "dragon_base", type: "dragon", name: "語彙ドラゴン(初期)", emoji: "🐉", src: null, isBase: true },

  // ---- 追加アイコン（PNG）: 各キャラクター5個 ----
  { id: "player_png_1", type: "player", name: "プレイヤー追加1", emoji: null, src: "assets/icons/player_1.png", isBase: false },
  { id: "player_png_2", type: "player", name: "プレイヤー追加2", emoji: null, src: "assets/icons/player_2.png", isBase: false },
  { id: "player_png_3", type: "player", name: "プレイヤー追加3", emoji: null, src: "assets/icons/player_3.png", isBase: false },
  { id: "player_png_4", type: "player", name: "プレイヤー追加4", emoji: null, src: "assets/icons/player_4.png", isBase: false },
  { id: "player_png_5", type: "player", name: "プレイヤー追加5", emoji: null, src: "assets/icons/player_5.png", isBase: false },

  { id: "goblin_png_1", type: "goblin", name: "ゴブリン追加1", emoji: null, src: "assets/icons/goblin_1.png", isBase: false },
  { id: "goblin_png_2", type: "goblin", name: "ゴブリン追加2", emoji: null, src: "assets/icons/goblin_2.png", isBase: false },
  { id: "goblin_png_3", type: "goblin", name: "ゴブリン追加3", emoji: null, src: "assets/icons/goblin_3.png", isBase: false },
  { id: "goblin_png_4", type: "goblin", name: "ゴブリン追加4", emoji: null, src: "assets/icons/goblin_4.png", isBase: false },
  { id: "goblin_png_5", type: "goblin", name: "ゴブリン追加5", emoji: null, src: "assets/icons/goblin_5.png", isBase: false },

  { id: "bat_png_1", type: "bat", name: "バット追加1", emoji: null, src: "assets/icons/bat_1.png", isBase: false },
  { id: "bat_png_2", type: "bat", name: "バット追加2", emoji: null, src: "assets/icons/bat_2.png", isBase: false },
  { id: "bat_png_3", type: "bat", name: "バット追加3", emoji: null, src: "assets/icons/bat_3.png", isBase: false },
  { id: "bat_png_4", type: "bat", name: "バット追加4", emoji: null, src: "assets/icons/bat_4.png", isBase: false },
  { id: "bat_png_5", type: "bat", name: "バット追加5", emoji: null, src: "assets/icons/bat_5.png", isBase: false },

  { id: "slime_png_1", type: "slime", name: "スライム追加1", emoji: null, src: "assets/icons/slime_1.png", isBase: false },
  { id: "slime_png_2", type: "slime", name: "スライム追加2", emoji: null, src: "assets/icons/slime_2.png", isBase: false },
  { id: "slime_png_3", type: "slime", name: "スライム追加3", emoji: null, src: "assets/icons/slime_3.png", isBase: false },
  { id: "slime_png_4", type: "slime", name: "スライム追加4", emoji: null, src: "assets/icons/slime_4.png", isBase: false },
  { id: "slime_png_5", type: "slime", name: "スライム追加5", emoji: null, src: "assets/icons/slime_5.png", isBase: false },

  { id: "ghost_png_1", type: "ghost", name: "オバケ追加1", emoji: null, src: "assets/icons/ghost_1.png", isBase: false },
  { id: "ghost_png_2", type: "ghost", name: "オバケ追加2", emoji: null, src: "assets/icons/ghost_2.png", isBase: false },
  { id: "ghost_png_3", type: "ghost", name: "オバケ追加3", emoji: null, src: "assets/icons/ghost_3.png", isBase: false },
  { id: "ghost_png_4", type: "ghost", name: "オバケ追加4", emoji: null, src: "assets/icons/ghost_4.png", isBase: false },
  { id: "ghost_png_5", type: "ghost", name: "オバケ追加5", emoji: null, src: "assets/icons/ghost_5.png", isBase: false },

  { id: "dragon_png_1", type: "dragon", name: "語彙ドラゴン追加1", emoji: null, src: "assets/icons/dragon_1.png", isBase: false },
  { id: "dragon_png_2", type: "dragon", name: "語彙ドラゴン追加2", emoji: null, src: "assets/icons/dragon_2.png", isBase: false },
  { id: "dragon_png_3", type: "dragon", name: "語彙ドラゴン追加3", emoji: null, src: "assets/icons/dragon_3.png", isBase: false },
  { id: "dragon_png_4", type: "dragon", name: "語彙ドラゴン追加4", emoji: null, src: "assets/icons/dragon_4.png", isBase: false },
  { id: "dragon_png_5", type: "dragon", name: "語彙ドラゴン追加5", emoji: null, src: "assets/icons/dragon_5.png", isBase: false }
];

export const DEFAULT_SELECTED_ICONS = {
  player: "player_base",
  goblin: "goblin_base",
  bat: "bat_base",
  slime: "slime_base",
  ghost: "ghost_base",
  dragon: "dragon_base"
};

export const DEFAULT_UNLOCKED_ICON_IDS = Object.values(DEFAULT_SELECTED_ICONS);

export const GACHA_RARE_RATE = 0.03;
