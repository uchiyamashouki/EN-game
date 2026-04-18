import { DEFAULT_SELECTED_ICONS, DEFAULT_UNLOCKED_ICON_IDS, GACHA_RARE_RATE, ICON_POOL } from "../deta/icons.js";

const iconById = new Map(ICON_POOL.map((icon) => [icon.id, icon]));

export function ensureIconState(state) {
  state.unlockedIconIds ||= [...DEFAULT_UNLOCKED_ICON_IDS];
  state.selectedIcons ||= { ...DEFAULT_SELECTED_ICONS };

  // セーブデータの重複混入にも対応して常に一意化する
  state.unlockedIconIds = [...new Set(state.unlockedIconIds.filter((id) => iconById.has(id)))];

  Object.entries(DEFAULT_SELECTED_ICONS).forEach(([type, id]) => {
    if (!state.selectedIcons[type] || !iconById.has(state.selectedIcons[type])) {
      state.selectedIcons[type] = id;
    }
    if (!state.unlockedIconIds.includes(state.selectedIcons[type])) {
      state.unlockedIconIds.push(state.selectedIcons[type]);
    }
  });
}

export function getIconById(id) {
  return iconById.get(id) ?? null;
}

export function getSelectedIcon(state, type) {
  ensureIconState(state);
  const selectedId = state.selectedIcons[type];
  return getIconById(selectedId);
}

export function getUnlockedIcons(state, type) {
  ensureIconState(state);
  return ICON_POOL.filter((icon) => icon.type === type && state.unlockedIconIds.includes(icon.id));
}

export function runGacha(state, count) {
  ensureIconState(state);

  // 未入手アイコンのみを排出対象にする（既出アイコンは二度と出ない）
  const remainingIds = new Set(
    ICON_POOL
      .filter((icon) => !icon.isBase)
      .map((icon) => icon.id)
      .filter((id) => !state.unlockedIconIds.includes(id))
  );
  const results = [];

  for (let i = 0; i < count; i += 1) {
    if (Math.random() < GACHA_RARE_RATE && remainingIds.size > 0) {
      const remainingIcons = ICON_POOL.filter((icon) => !icon.isBase && remainingIds.has(icon.id));
      const pickIndex = Math.floor(Math.random() * remainingIcons.length);
      const picked = remainingIcons[pickIndex];

      remainingIds.delete(picked.id);
      state.unlockedIconIds.push(picked.id);
      results.push({ won: true, icon: picked });
    } else {
      results.push({ won: false, icon: null });
    }
  }

  return results;
}
