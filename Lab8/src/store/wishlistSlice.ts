import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  ids: number[];
}
const initialState: WishlistState = { ids: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<number>) {
      const index = state.ids.indexOf(action.payload);
      if (index >= 0) state.ids.splice(index, 1);
      else state.ids.push(action.payload);
    },
    hydrateWishlist(state, action: PayloadAction<number[]>) {
      state.ids = action.payload;
    },
  },
});

export const { toggleWishlist, hydrateWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
