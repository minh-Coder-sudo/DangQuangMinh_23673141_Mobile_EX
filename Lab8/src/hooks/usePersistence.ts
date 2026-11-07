import { useEffect, useState } from "react";
import { hydrateCart } from "../store/cartSlice";
import { setCredentials } from "../store/authSlice";
import { hydrateWishlist } from "../store/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CartItem } from "../types";
import { clearAuth, loadAuth, saveAuth } from "../storage/authStorage";
import { loadJSON } from "../storage/storage";
import { useAutoPersist } from "./useAutoPersist";

const CART_KEY = "@bookstore/cart";
const WISHLIST_KEY = "@bookstore/wishlist";

export function usePersistence() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistIds = useAppSelector((state) => state.wishlist.ids);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [auth, cart, wish] = await Promise.all([
        loadAuth(),
        loadJSON<CartItem[]>(CART_KEY),
        loadJSON<number[]>(WISHLIST_KEY),
      ]);
      if (auth?.token && auth.user) dispatch(setCredentials(auth));
      if (cart) dispatch(hydrateCart(cart));
      if (wish) dispatch(hydrateWishlist(wish));
      setReady(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;
    if (user && token) void saveAuth({ user, token });
    else void clearAuth();
  }, [ready, user, token]);

  useAutoPersist(CART_KEY, cartItems, ready);
  useAutoPersist(WISHLIST_KEY, wishlistIds, ready);
  return ready;
}
