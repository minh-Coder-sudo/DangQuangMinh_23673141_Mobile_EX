import { Switch, Text, View } from "react-native";
import { useAppStateContext } from "../../state/AppContext";
import { colors, s } from "../../theme";
export default function Settings() {
  const { notify, setNotify, dark, setDark } = useAppStateContext();
  const text = { color: dark ? "#fff" : colors.text };
  return (
    <View
      style={[s.root, s.pad, { backgroundColor: dark ? "#171B27" : "#fff" }]}
    >
      <View style={[s.row, { justifyContent: "space-between" }]}>
        <Text style={[s.text, text]}>Nhận thông báo</Text>
        <Switch
          accessibilityLabel="Nhận thông báo"
          value={notify}
          onValueChange={setNotify}
        />
      </View>
      <View style={[s.row, { justifyContent: "space-between" }]}>
        <Text style={[s.text, text]}>Giao diện tối</Text>
        <Switch
          accessibilityLabel="Giao diện tối"
          value={dark}
          onValueChange={setDark}
        />
      </View>
      <Text style={[s.text, text]}>
        Thông báo: {notify ? "BẬT" : "TẮT"} · Giao diện: {dark ? "tối" : "sáng"}
      </Text>
    </View>
  );
}
