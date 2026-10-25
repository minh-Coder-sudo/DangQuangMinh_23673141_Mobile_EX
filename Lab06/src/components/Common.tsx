import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Phone } from "../types";
import { colors, formatPrice, s } from "../theme";
export function Button({
  title,
  onPress,
  blue = false,
}: {
  title: string;
  onPress: () => void;
  blue?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        blue && { backgroundColor: colors.blue },
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={s.buttonText}>{title}</Text>
    </Pressable>
  );
}
export function MenuLink() {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.dismissTo("/")}
      style={{ padding: 8 }}
    >
      <Text style={{ color: colors.blue }}>Menu bài tập</Text>
    </Pressable>
  );
}
export function Stars({ value }: { value: number }) {
  const count = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <Text
      accessibilityLabel={`${count} trên 5 sao`}
      style={{ color: colors.star, fontSize: 21 }}
    >
      {"★".repeat(count)}
      <Text style={{ color: colors.line }}>{"★".repeat(5 - count)}</Text>
    </Text>
  );
}
export function Loading() {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={colors.blue} />
      <Text>Đang tải...</Text>
    </View>
  );
}
export function ErrorBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={s.center}>
      <Text style={s.title}>Không thể tải sản phẩm</Text>
      <Text style={s.text}>{message}</Text>
      <Button title="THỬ LẠI" onPress={onRetry} />
    </View>
  );
}
export function PhoneList({
  phones,
  onSelect,
  empty = "Chưa có sản phẩm nào được lưu.",
}: {
  phones: Phone[];
  onSelect?: (p: Phone) => void;
  empty?: string;
}) {
  return (
    <FlatList
      data={phones}
      keyExtractor={(p) => p.id}
      contentContainerStyle={[s.pad, { flexGrow: 1 }]}
      ListEmptyComponent={<Text style={s.muted}>{empty}</Text>}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole={onSelect ? "button" : undefined}
          onPress={() => onSelect?.(item)}
          style={s.card}
        >
          <Text style={[s.text, { fontWeight: "600" }]}>
            {item.name.split(" - ")[0]}
          </Text>
          <Stars value={item.rating} />
          <Text style={{ color: colors.red, fontWeight: "700" }}>
            {formatPrice(item.price)}
          </Text>
          {onSelect && <Text style={s.muted}>Xem chi tiết →</Text>}
        </Pressable>
      )}
    />
  );
}
export function Profile({ dark = false }: { dark?: boolean }) {
  return (
    <View style={[s.center, { backgroundColor: dark ? "#171B27" : "#fff" }]}>
      <View style={s.avatar}>
        <Text style={[s.title, { color: "#fff" }]}>NA</Text>
      </View>
      <Text style={[s.title, dark && { color: "#fff" }]}>Nguyễn Văn An</Text>
      <Text style={[s.muted, dark && { color: "#BDC5D9" }]}>
        an.nguyen@example.com
      </Text>
    </View>
  );
}
