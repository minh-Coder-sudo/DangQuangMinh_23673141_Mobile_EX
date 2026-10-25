import { Drawer } from "expo-router/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MenuLink } from "../../components/Common";
import { useAppStateContext } from "../../state/AppContext";
import { colors } from "../../theme";
export default function Layout() {
  const { dark } = useAppStateContext();
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: colors.red,
        headerRight: () => <MenuLink />,
        headerStyle: { backgroundColor: dark ? "#171B27" : "#fff" },
        headerTintColor: dark ? "#fff" : colors.text,
        drawerStyle: { backgroundColor: dark ? "#171B27" : "#fff" },
        drawerInactiveTintColor: dark ? "#fff" : colors.text,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Trang chủ",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Cá nhân",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Cài đặt",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
