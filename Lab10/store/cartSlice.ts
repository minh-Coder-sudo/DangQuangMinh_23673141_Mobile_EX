import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book, CartItem } from "../types";
import type { RootState } from "./index";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[] },
  reducers: {
    addToCart(state, action: PayloadAction<Pick<Book, "id" | "title" | "price">>) {
      const current = state.items.find((item) => item.bookId === action.payload.id);
      if (current) {
        current.quantity += 1;
      } else {
        state.items.push({
          bookId: action.payload.id,
          title: action.payload.title,
          price: action.payload.price,
          quantity: 1,
        });
      }
    },
    decrease(state, action: PayloadAction<string>) {
      const current = state.items.find((item) => item.bookId === action.payload);
      if (!current) return;
      if (current.quantity <= 1) {
        state.items = state.items.filter((item) => item.bookId !== action.payload);
      } else {
        current.quantity -= 1;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, decrease, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState): number =>
  s.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (s: RootState): number =>
  s.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
