import { StyleSheet, Text, View } from "react-native";
import { PHONE_COLORS } from "../data/phones";
import { ColorKey } from "../types";
// Local illustration until the original Figma product photography is available.
export function PhoneImage({
  color,
  small = false,
  brand = "Vsmart",
}: {
  color: ColorKey;
  small?: boolean;
  brand?: string;
}) {
  return (
    <View
      accessibilityLabel={`Điện thoại màu ${PHONE_COLORS[color].label}`}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: small ? 104 : "100%",
        height: small ? 140 : 310,
      }}
    >
      <View
        style={[
          styles.back,
          {
            backgroundColor: PHONE_COLORS[color].hex,
            width: small ? 64 : 138,
            height: small ? 125 : 275,
          },
        ]}
      >
        <View style={styles.camera}>
          <View style={styles.lens} />
          <View style={styles.lens} />
        </View>
        <Text style={[styles.brand, small && { fontSize: 10 }]}>{brand}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  back: {
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#666C7B",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "4px 7px 12px #00000025",
  },
  camera: {
    position: "absolute",
    top: 12,
    left: 9,
    borderRadius: 12,
    padding: 4,
    gap: 4,
    backgroundColor: "#111",
  },
  lens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#677385",
    backgroundColor: "#151724",
  },
  brand: { color: "#fff", fontSize: 19, fontWeight: "700" },
});
