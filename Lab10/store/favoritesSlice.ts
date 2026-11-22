import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { ids: [] as string[] },
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter((id) => id !== action.payload);
      } else {
        state.ids.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const selectFavoriteIds = (s: RootState) => s.favorites.ids;
export const selectIsFavorite = (id: string) => (s: RootState) => s.favorites.ids.includes(id);
