import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

interface Props {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
}

export function RatingStars({ value, size = 18, onChange }: Props) {
  const filled = Math.round(value);
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((number) => {
        const star = <Text style={{ fontSize: size, color: number <= filled ? colors.warning : colors.line }}>★</Text>;
        return onChange ? (
          <Pressable key={number} onPress={() => onChange(number)} hitSlop={4} accessibilityLabel={`${number} sao`}>
            {star}
          </Pressable>
        ) : <React.Fragment key={number}>{star}</React.Fragment>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: "row" } });
