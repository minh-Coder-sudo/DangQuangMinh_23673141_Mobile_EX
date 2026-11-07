import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CartItem } from "../types";
import { colors, formatPrice, radius } from "../theme";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  item: CartItem;
  onChangeQty: (bookId: number, quantity: number) => void;
  onRemove: (bookId: number) => void;
}

export function CartItemRow({ item, onChangeQty, onRemove }: Props) {
  const [qty, setQty] = useState(item.quantity);
  const debouncedQty = useDebounce(qty, 300);
  useEffect(() => {
    if (debouncedQty !== item.quantity) onChangeQty(item.bookId, debouncedQty);
  }, [debouncedQty, item.bookId, item.quantity, onChangeQty]);
  useEffect(() => { setQty(item.quantity); }, [item.quantity]);
  const canDec = qty > 1;
  const canInc = qty < item.stock;

  return (
    <View style={styles.row}>
      <View style={[styles.cover, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.quantity}>
          <Pressable disabled={!canDec} onPress={() => setQty((value) => value - 1)} style={[styles.qtyButton, !canDec && styles.disabled]} accessibilityLabel="Giảm"><Text style={styles.qtyButtonText}>−</Text></Pressable>
          <Text style={styles.qty}>{qty}</Text>
          <Pressable disabled={!canInc} onPress={() => setQty((value) => value + 1)} style={[styles.qtyButton, !canInc && styles.disabled]} accessibilityLabel="Tăng"><Text style={styles.qtyButtonText}>+</Text></Pressable>
        </View>
        <Text style={styles.stock}>Còn {item.stock}</Text>
        <Pressable onPress={() => onRemove(item.bookId)} accessibilityLabel="Xóa sản phẩm"><Text style={styles.remove}>🗑️</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, padding: 10, marginHorizontal: 12, marginVertical: 5, gap: 10 },
  cover: { width: 54, height: 72, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 26 },
  info: { flex: 1 },
  title: { fontWeight: "700", color: colors.text },
  price: { color: colors.indigo, fontWeight: "800", marginTop: 4 },
  actions: { alignItems: "flex-end", gap: 4 },
  quantity: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm },
  qtyButton: { width: 27, height: 28, alignItems: "center", justifyContent: "center" },
  qtyButtonText: { fontSize: 20, color: colors.indigo, fontWeight: "700" },
  qty: { minWidth: 24, textAlign: "center", fontWeight: "800", color: colors.navy },
  stock: { color: colors.muted, fontSize: 12 },
  remove: { fontSize: 17 },
  disabled: { opacity: 0.35 },
});
