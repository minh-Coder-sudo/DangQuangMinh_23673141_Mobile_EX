import { Text, View } from "react-native";
import { useAppStateContext } from "../../state/AppContext";
import { s } from "../../theme";
export default function Home() {
  const { dark } = useAppStateContext();
  return (
    <View style={[s.center, { backgroundColor: dark ? "#171B27" : "#fff" }]}>
      <Text style={[s.title, dark && { color: "#fff" }]}>Xin chào 👋</Text>
      <Text style={[s.muted, dark && { color: "#BDC5D9" }]}>
        Vuốt từ cạnh trái hoặc bấm ☰ để mở menu.
      </Text>
    </View>
  );
}
