import { Stack } from "expo-router";
import { PhoneSessionProvider } from "../../state/PhoneSessionContext";
export default function Layout() {
  return (
    <PhoneSessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PhoneSessionProvider>
  );
}
