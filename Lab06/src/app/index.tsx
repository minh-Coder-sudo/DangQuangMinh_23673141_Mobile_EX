import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";
import { colors, s } from "../theme";
const lessons = [
  {
    title: "Bài 1 · Select Phone",
    detail: "Thông tin sản phẩm, chọn 4 màu và nhận kết quả quay lại.",
    href: "/select?mode=local",
  },
  {
    title: "Bài 2 · Kết nối API",
    detail: "Tải sản phẩm, trạng thái chờ, báo lỗi và thử lại.",
    href: "/select?mode=api",
  },
  {
    title: "Bài 3 · Bottom Tab",
    detail: "Trang chủ, tìm kiếm sản phẩm và hồ sơ cá nhân.",
    href: "/tabs",
  },
  {
    title: "Bài 4 · Stack + Tab",
    detail: "Truyền mã sản phẩm và lưu danh sách yêu thích.",
    href: "/catalog",
  },
  {
    title: "Bài 5 · Drawer",
    detail: "Menu bên, thông báo và giao diện sáng / tối.",
    href: "/drawer",
  },
] as const;
export default function Menu() {
  return (
    <ScrollView
      contentContainerStyle={s.pad}
      style={{ backgroundColor: colors.bg }}
    >
      <Text style={s.title}>Thực hành điều hướng</Text>
      <Text style={s.muted}>Expo · React Native · TypeScript</Text>
      {lessons.map((l) => (
        <Link key={l.title} href={l.href} asChild>
          <Pressable style={s.card}>
            <Text style={[s.text, { fontWeight: "700" }]}>{l.title} →</Text>
            <Text style={s.muted}>{l.detail}</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
