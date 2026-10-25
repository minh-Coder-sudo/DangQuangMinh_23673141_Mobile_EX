import { PHONES } from "../data/phones";
import { parsePhone } from "../data/phoneValidation";
import { Phone } from "../types";
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(
  /\/+$/,
  "",
);
export const USING_API = Boolean(API_URL);
export async function fetchPhone(
  id: string,
  signal?: AbortSignal,
): Promise<Phone> {
  if (!USING_API) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const phone = PHONES.find((p) => p.id === id);
    if (!phone) throw new Error("Không tìm thấy sản phẩm");
    return phone;
  }
  const response = await fetch(`${API_URL}/phones/${encodeURIComponent(id)}`, {
    signal,
  });
  if (!response.ok) throw new Error(`Máy chủ trả về lỗi ${response.status}`);
  return parsePhone(await response.json());
}
