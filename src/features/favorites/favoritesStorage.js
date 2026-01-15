const STORAGE_KEY = "traveltrucks_favorites";

export function loadFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavoritesToStorage(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage dolu vs. olursa sessiz geç
  }
}

// Redux middleware: favorites değişince storage’a yaz
export const favoritesStorageMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  // Sadece favorites slice aksiyonlarında yazalım
  if (action.type.startsWith("favorites/")) {
    const ids = storeApi.getState().favorites.ids;
    saveFavoritesToStorage(ids);
  }

  return result;
};
