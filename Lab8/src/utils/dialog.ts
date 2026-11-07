import { Alert, Platform } from "react-native";

export function confirmDialog(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === "web") {
    const confirm = (globalThis as { confirm?: (text: string) => boolean }).confirm;
    if (confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: "Hủy", style: "cancel" },
    { text: "Xóa", style: "destructive", onPress: onConfirm },
  ]);
}
