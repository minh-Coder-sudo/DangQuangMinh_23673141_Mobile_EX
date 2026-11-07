import { User } from "../types";
import { loadJSON, remove, saveJSON } from "./storage";

const AUTH_KEY = "@bookstore/auth";

export interface StoredAuth {
  user: User;
  token: string;
}

export function saveAuth(auth: StoredAuth) {
  return saveJSON(AUTH_KEY, auth);
}

export function loadAuth() {
  return loadJSON<StoredAuth>(AUTH_KEY);
}

export function clearAuth() {
  return remove(AUTH_KEY);
}
