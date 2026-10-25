import { ColorKey, Phone } from "../types";
import phoneData from "../../mockapi_phones_50.json";
import { parsePhone } from "./phoneValidation";
export { COLOR_ORDER, isColor } from "./phoneValidation";
export const PHONE_COLORS: Record<ColorKey, { label: string; hex: string }> = {
  silver: { label: "bạc", hex: "#C9EEFA" },
  red: { label: "đỏ", hex: "#E53A2F" },
  black: { label: "đen", hex: "#16171B" },
  blue: { label: "xanh", hex: "#2A4494" },
};
export const PHONES: Phone[] = phoneData.map(parsePhone);
