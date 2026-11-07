import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useAuth, useWishlist } from "../store/hooks";
import { colors, radius } from "../theme";
import { TabScreenProps } from "../navigation/types";

export function AccountScreen({ navigation }: TabScreenProps<"Account">) {
  const { user, isLoggedIn, signOut } = useAuth();
  const { ids } = useWishlist();

  return (
    <View style={styles.container}>
      <Header title="👤 Tài khoản" />
      <View style={styles.box}>
        {isLoggedIn && user ? (
          <>
          <Text style={styles.avatar}>🙂</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={signOut}>
            <Text style={styles.btnOutlineText}>Đăng xuất</Text>
          </Pressable>
          </>
        ) : (
          <>
          <Text style={styles.avatar}>🔒</Text>
          <Text style={styles.name}>Bạn chưa đăng nhập</Text>
          <Pressable
            style={styles.btn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.btnText}>Đăng nhập</Text>
          </Pressable>
          </>
        )}
        <Pressable style={styles.wishlist} onPress={() => navigation.navigate("Wishlist")}>
          <Text style={styles.wishlistText}>♥ Danh sách yêu thích ({ids.length})</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  box: { alignItems: "center", padding: 24, gap: 8 },
  avatar: { fontSize: 64 },
  name: { fontSize: 20, fontWeight: "800", color: colors.text },
  email: { color: colors.muted },
  wishlist: { marginTop: 8, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff", borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  wishlistText: { color: colors.heart, fontWeight: "700" },
  btn: { backgroundColor: colors.indigo, paddingVertical: 12, paddingHorizontal: 20, borderRadius: radius.md, marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "800" },
  btnOutline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.indigo },
  btnOutlineText: { color: colors.indigo, fontWeight: "800" },
});
