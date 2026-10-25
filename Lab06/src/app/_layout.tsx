import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "../state/AppContext";
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ title: "Lab 06 · Navigation" }}
          />
          <Stack.Screen name="select" options={{ headerShown: false }} />
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen name="catalog" options={{ headerShown: false }} />
          <Stack.Screen name="drawer" options={{ headerShown: false }} />
        </Stack>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
