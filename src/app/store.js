import { configureStore } from "@reduxjs/toolkit";
import campersReducer from "../features/campers/campersSlice";
import filtersReducer from "../features/filters/filtersSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import { favoritesStorageMiddleware } from "../features/favorites/favoritesStorage";

export const store = configureStore({
  reducer: {
    campers: campersReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(favoritesStorageMiddleware),
});
