import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "../theme";

export function PrimaryButton({ title, onPress, loading = false }: { title: string; onPress: () => void; loading?: boolean }) {
  return (
    <Pressable style={[styles.button, loading && styles.disabled]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: "center", justifyContent: "center", minHeight: 48, backgroundColor: colors.indigo, borderRadius: radius.md, paddingHorizontal: 18 },
  disabled: { opacity: 0.6 },
  text: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
