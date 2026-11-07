import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { useWishlist } from "../store/hooks";
import { colors } from "../theme";

interface Props {
  bookId: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function HeartButton({ bookId, size = 34, style }: Props) {
  const { isFavorite, toggle } = useWishlist();
  const favorite = isFavorite(bookId);
  return (
    <Pressable
      style={[styles.button, style]}
      onPress={(event) => { event.stopPropagation(); toggle(bookId); }}
      hitSlop={5}
      accessibilityLabel={favorite ? "Bỏ yêu thích" : "Yêu thích"}
    >
      <Text style={{ fontSize: size, lineHeight: size + 2, color: favorite ? colors.heart : colors.muted }}>{favorite ? "♥" : "♡"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({ button: { alignItems: "center", justifyContent: "center" } });
