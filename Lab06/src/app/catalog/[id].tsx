import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import { Button, Stars } from "../../components/Common";
import { PhoneImage } from "../../components/PhoneImage";
import { PHONES } from "../../data/phones";
import { useAppStateContext } from "../../state/AppContext";
import { formatPrice, s } from "../../theme";
export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = PHONES.find((p) => p.id === id);
  const { ids, toggle } = useAppStateContext();
  if (!p) return <Text style={s.pad}>Không tìm thấy sản phẩm #{id}</Text>;
  return (
    <ScrollView contentContainerStyle={s.pad} style={s.root}>
      <PhoneImage
        color={p.defaultColor}
        brand={p.name.replace("Điện Thoại ", "").split(" ")[0]}
      />
      <Text style={s.title}>{p.name}</Text>
      <Stars value={p.rating} />
      <Text style={s.title}>{formatPrice(p.price)}</Text>
      <Text style={s.text}>Cung cấp bởi {p.supplier}</Text>
      <Button
        title={ids.includes(p.id) ? "♥ Đã lưu" : "♡ Lưu vào yêu thích"}
        onPress={() => toggle(p.id)}
      />
    </ScrollView>
  );
}
