import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { PHONES, PHONE_COLORS, isColor } from "../data/phones";
import { USING_API } from "../api/phoneApi";
import { usePhoneSession } from "../state/PhoneSessionContext";
import {
  Button,
  ErrorBox,
  Loading,
  MenuLink,
  Stars,
} from "../components/Common";
import { PhoneImage } from "../components/PhoneImage";
import { colors, formatPrice, s } from "../theme";
import { ColorKey, Phone } from "../types";
export default function SelectPhone({ choose = false }: { choose?: boolean }) {
  const { mode = "local", color } = useLocalSearchParams<{
    mode?: string;
    color?: string;
  }>();
  const [phone, setPhone] = useState<Phone | null>(
    mode === "api" ? null : PHONES[0],
  );
  const [error, setError] = useState<string | null>(null);
  const loadPhone = usePhoneSession();
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setError(null);
    setPhone(null);
    setAttempt((n) => n + 1);
  }, []);
  const [picked, setPicked] = useState<ColorKey | undefined>(
    isColor(color) ? color : undefined,
  );
  useEffect(() => {
    let active = true;
    loadPhone(mode, attempt > 0)
      .then((p) => {
        if (active) setPhone(p);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error && e.name === "AbortError"
              ? "Kết nối quá thời gian. Vui lòng thử lại."
              : e instanceof Error
                ? e.message
                : "Không thể kết nối API",
          );
      });
    return () => {
      active = false;
    };
  }, [mode, attempt, loadPhone]);
  if (error)
    return (
      <SafeAreaView style={s.root}>
        <MenuLink />
        <ErrorBox message={error} onRetry={retry} />
      </SafeAreaView>
    );
  if (!phone)
    return (
      <SafeAreaView style={s.root}>
        <MenuLink />
        <Loading />
      </SafeAreaView>
    );
  const candidate = choose ? picked : isColor(color) ? color : undefined;
  const selected =
    candidate && phone.colors.includes(candidate) ? candidate : undefined;
  const shown = selected ?? phone.defaultColor;
  if (choose)
    return (
      <SafeAreaView style={s.root}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={[s.row, { padding: 16, alignItems: "flex-start" }]}>
            <PhoneImage
              color={shown}
              small
              brand={phone.name.replace("Điện Thoại ", "").split(" ")[0]}
            />
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={s.text}>{phone.name.split(" - ")[0]}</Text>
              <Text style={s.text}>
                {phone.name.split(" - ").slice(1).join(" - ")}
              </Text>
              {selected && (
                <>
                  <Text>
                    Màu:{" "}
                    <Text style={{ fontWeight: "700" }}>
                      {PHONE_COLORS[selected].label}
                    </Text>
                  </Text>
                  <Text>
                    Cung cấp bởi{" "}
                    <Text style={{ fontWeight: "700" }}>{phone.supplier}</Text>
                  </Text>
                  <Text style={{ fontWeight: "700" }}>
                    {formatPrice(phone.price)}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.grey,
              padding: 20,
              gap: 16,
            }}
          >
            <Text style={s.text}>Chọn một màu bên dưới:</Text>
            <View style={{ alignItems: "center", gap: 14, flex: 1 }}>
              {phone.colors.map((key) => (
                <Pressable
                  key={key}
                  accessibilityRole="radio"
                  accessibilityLabel={`Màu ${PHONE_COLORS[key].label}`}
                  accessibilityState={{ selected: selected === key }}
                  onPress={() => setPicked(key)}
                  style={{
                    width: 76,
                    height: 76,
                    backgroundColor: PHONE_COLORS[key].hex,
                    borderWidth: selected === key ? 3 : 1,
                    borderColor: selected === key ? colors.navy : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selected === key && (
                    <Text
                      style={{
                        color: key === "silver" ? colors.navy : "#fff",
                        fontSize: 24,
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
            <Button
              title="XONG"
              blue
              onPress={() =>
                router.dismissTo({
                  pathname: "/select",
                  params: { mode, ...(picked ? { color: picked } : {}) },
                })
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}>
        <MenuLink />
        {mode === "api" && (
          <Text style={s.muted}>
            {USING_API
              ? "Dữ liệu từ API"
              : "Dữ liệu mẫu offline · Chưa cấu hình API"}
          </Text>
        )}
        <View style={{ flex: 1, justifyContent: "center", minHeight: 300 }}>
          <PhoneImage
            color={shown}
            brand={phone.name.replace("Điện Thoại ", "").split(" ")[0]}
          />
        </View>
        <Text style={s.text}>{phone.name}</Text>
        <View style={s.row}>
          <Stars value={phone.rating} />
          <Text style={s.muted}>(Xem {phone.reviewCount} đánh giá)</Text>
        </View>
        <View style={s.row}>
          <Text style={s.title}>{formatPrice(phone.price)}</Text>
          <Text style={[s.muted, { textDecorationLine: "line-through" }]}>
            {formatPrice(phone.oldPrice)}
          </Text>
        </View>
        <View style={s.row}>
          <Text style={{ color: colors.red, fontWeight: "700", fontSize: 13 }}>
            {phone.badge}
          </Text>
          <Pressable
            accessibilityLabel="Thông tin hoàn tiền"
            onPress={() =>
              Alert.alert(
                "Cam kết giá",
                "Liên hệ nhà cung cấp để biết điều kiện hoàn tiền.",
              )
            }
          >
            <Text>ⓘ</Text>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/select/choose",
              params: { mode, ...(selected ? { color: selected } : {}) },
            })
          }
          style={{
            borderWidth: 1,
            borderColor: "#777",
            borderRadius: 6,
            minHeight: 42,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>4 MÀU-CHỌN {selected ? "LOẠI" : "MÀU"}</Text>
          <Text style={{ position: "absolute", right: 12, fontSize: 24 }}>
            ›
          </Text>
        </Pressable>
        <View style={{ height: 18 }} />
      </ScrollView>
      <View style={{ padding: 16 }}>
        <Button
          title="CHỌN MUA"
          onPress={() =>
            Alert.alert(
              "Đã chọn sản phẩm",
              `${phone.name}\nMàu: ${PHONE_COLORS[shown].label}\n${formatPrice(phone.price)}`,
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
