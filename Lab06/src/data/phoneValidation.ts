import type { ColorKey, Phone } from "../types";

export const COLOR_ORDER: ColorKey[] = ["silver", "red", "black", "blue"];

export const isColor = (value: unknown): value is ColorKey =>
  COLOR_ORDER.includes(value as ColorKey);

/** Validate at the API/JSON boundary instead of hiding malformed server data. */
export function parsePhone(value: unknown): Phone {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Dữ liệu điện thoại phải là một đối tượng JSON.");
  }
  const p = value as Record<string, unknown>;
  const fail = (field: string): never => {
    throw new Error(
      `Sản phẩm #${String(p.id ?? "?")}: trường ${field} không hợp lệ.`,
    );
  };
  if (typeof p.id !== "string" || !p.id.trim()) fail("id");
  for (const field of ["name", "supplier", "badge"] as const) {
    if (typeof p[field] !== "string" || !p[field].trim()) fail(field);
  }
  for (const field of ["price", "oldPrice", "reviewCount", "rating"] as const) {
    if (
      typeof p[field] !== "number" ||
      !Number.isFinite(p[field]) ||
      p[field] < 0
    )
      fail(field);
  }
  if (!Number.isInteger(p.rating) || (p.rating as number) > 5)
    fail("rating (số nguyên từ 0 đến 5)");
  if (!Number.isInteger(p.reviewCount)) fail("reviewCount (số nguyên)");
  if ((p.oldPrice as number) < (p.price as number))
    fail("oldPrice (phải lớn hơn hoặc bằng price)");
  if (
    !Array.isArray(p.colors) ||
    p.colors.length === 0 ||
    !p.colors.every(isColor) ||
    new Set(p.colors).size !== p.colors.length
  )
    fail("colors");
  if (
    !isColor(p.defaultColor) ||
    !(p.colors as ColorKey[]).includes(p.defaultColor)
  )
    fail("defaultColor");
  return {
    id: p.id as string,
    name: p.name as string,
    price: p.price as number,
    oldPrice: p.oldPrice as number,
    rating: p.rating as number,
    reviewCount: p.reviewCount as number,
    supplier: p.supplier as string,
    badge: p.badge as string,
    colors: [...(p.colors as ColorKey[])],
    defaultColor: p.defaultColor as ColorKey,
  };
}
