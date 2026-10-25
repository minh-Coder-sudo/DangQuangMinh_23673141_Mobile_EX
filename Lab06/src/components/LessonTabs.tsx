import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../theme";
import { MenuLink } from "./Common";
export function LessonTabs({ catalog = false }: { catalog?: boolean }) {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.red,
        headerRight: () => <MenuLink />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: catalog ? "Sản phẩm" : "Trang chủ",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      {catalog ? (
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Yêu thích",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <>
          <Tabs.Screen
            name="search"
            options={{
              title: "Tìm kiếm",
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "search" : "search-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Cá nhân",
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </>
      )}
    </Tabs>
  );
}
