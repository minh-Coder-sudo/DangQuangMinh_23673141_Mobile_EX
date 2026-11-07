import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { getErrorMessage } from "../api/client";
import { login } from "../services/authService";
import { useAuth } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { validateEmail, validatePassword } from "../utils/validators";
import { colors } from "../theme";

export function LoginScreen({ navigation, route }: RootScreenProps<"Login">) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const nextErrors = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const { user, token } = await login(email, password);
      signIn(user, token);
      if (route.params?.redirectTo === "Checkout") navigation.replace("Checkout", { total: route.params.total ?? 0 });
      else navigation.navigate("Tabs", { screen: "Home" });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Chào mừng trở lại</Text>
      <Text style={styles.subtitle}>Đăng nhập để tiếp tục mua sách và viết đánh giá.</Text>
      <FormField label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" />
      <FormField
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry={!showPassword}
        rightAccessory={<Pressable onPress={() => setShowPassword((value) => !value)} style={styles.eye} accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}><Text>{showPassword ? "🙈" : "👁"}</Text></Pressable>}
      />
      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
      <PrimaryButton title="Đăng nhập" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.navigate("Register", route.params)}><Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.bg, padding: 22, justifyContent: "center", gap: 14 },
  title: { fontSize: 26, color: colors.navy, fontWeight: "800" },
  subtitle: { color: colors.muted, lineHeight: 21, marginBottom: 10 },
  eye: { paddingHorizontal: 12, paddingVertical: 10 },
  submitError: { color: colors.danger, textAlign: "center" },
  link: { color: colors.indigo, fontWeight: "700", textAlign: "center", marginTop: 4 },
});
