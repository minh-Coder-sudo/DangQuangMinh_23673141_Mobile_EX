import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadJSON<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
