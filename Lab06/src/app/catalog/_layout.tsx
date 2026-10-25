import { Stack } from "expo-router";
import { MenuLink } from "../../components/Common";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Chi tiết sản phẩm",
          headerRight: () => <MenuLink />,
        }}
      />
    </Stack>
  );
}
