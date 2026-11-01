import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PRICE_RANGES, PriceRange } from "../utils/filters";
import { colors, radius } from "../theme";

interface Props {
  value: PriceRange;
  onChange: (v: PriceRange) => void;
}

export function PriceFilter({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {PRICE_RANGES.map((range) => {
        const active = value === range.key;
        return (
          <Pressable key={range.key} style={[styles.btn, active && styles.btnActive]} onPress={() => onChange(active ? null : range.key)}>
            <Text style={[styles.text, active && styles.textActive]}>{range.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 12, paddingBottom: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  btnActive: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  text: { color: colors.text, fontWeight: "600" },
  textActive: { color: "#fff" },
});
