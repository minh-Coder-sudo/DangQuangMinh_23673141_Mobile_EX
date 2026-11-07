import React from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../theme";

interface Props {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  rightAccessory?: React.ReactNode;
}

export function FormField({ label, value, onChangeText, error, secureTextEntry, keyboardType, rightAccessory }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={styles.input}
          placeholder={label}
          placeholderTextColor={colors.muted}
        />
        {rightAccessory}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 5 },
  label: { color: colors.text, fontWeight: "700" },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  inputError: { borderColor: colors.danger },
  input: { flex: 1, paddingHorizontal: 13, paddingVertical: 12, color: colors.text, fontSize: 16 },
  error: { color: colors.danger, fontSize: 13 },
});
