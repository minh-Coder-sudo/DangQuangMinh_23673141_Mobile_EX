import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { getErrorMessage } from "../api/client";
import { register } from "../services/authService";
import { useAuth } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { validateEmail, validatePassword, validateRequired } from "../utils/validators";
import { colors } from "../theme";

export function RegisterScreen({ navigation, route }: RootScreenProps<"Register">) {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const nextErrors = {
      name: validateRequired("họ tên")(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: !confirm ? "Vui lòng nhập lại mật khẩu" : confirm === password ? null : "Mật khẩu nhập lại không khớp",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const { user, token } = await register(name, email, password);
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
      <Text style={styles.title}>Tạo tài khoản</Text>
      <FormField label="Họ tên" value={name} onChangeText={setName} error={errors.name} />
      <FormField label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" />
      <FormField label="Mật khẩu" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry />
      <FormField label="Nhập lại mật khẩu" value={confirm} onChangeText={setConfirm} error={errors.confirm} secureTextEntry />
      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
      <PrimaryButton title="Đăng ký" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.goBack()}><Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.bg, padding: 22, justifyContent: "center", gap: 14 },
  title: { fontSize: 26, color: colors.navy, fontWeight: "800", marginBottom: 10 },
  submitError: { color: colors.danger, textAlign: "center" },
  link: { color: colors.indigo, fontWeight: "700", textAlign: "center", marginTop: 4 },
});
