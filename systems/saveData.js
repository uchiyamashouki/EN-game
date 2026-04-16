const SAVE_KEY = "en_game_save_v1";

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

export function loadGame() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
}

export function saveGame(state) {
  const storage = getStorage();
  if (!storage) return false;

  try {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (_error) {
    return false;
  }
}
