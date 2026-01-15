import { createSlice } from "@reduxjs/toolkit";
import { loadFavoritesFromStorage } from "./favoritesStorage";

const initialState = {
  ids: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const id = String(action.payload);
      const exists = state.ids.includes(id);

      if (exists) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids.push(id);
      }
    },
    clearFavorites(state) {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
