import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./screens/HomeScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { CartScreen } from "./screens/CartScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { useAppSelector } from "./store/hooks";
import { selectCartCount } from "./store/cartSlice";
import { colors } from "./theme";

export type RootStackParamList = {
  Tabs: undefined;
  Detail: { id: string };
};
export type TabParamList = { Home: undefined; Cart: undefined; Favorites: undefined };

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const cartCount = useAppSelector(selectCartCount);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.indigo }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Sách" }} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Giỏ hàng", tabBarBadge: cartCount || undefined }}
      />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: "Yêu thích" }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Chi tiết sách" }} />
    </Stack.Navigator>
  );
}
