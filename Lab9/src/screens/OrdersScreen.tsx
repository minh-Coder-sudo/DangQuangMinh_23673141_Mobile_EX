import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getOrdersByUser } from "../services/orderService";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { formatDateTime } from "../utils/format";
import { RootScreenProps } from "../navigation/types";
import { Order } from "../types";
import { colors, formatPrice, radius } from "../theme";

const PAYMENT_LABEL = { cod: "Thanh toán khi nhận hàng (COD)", bank: "Chuyển khoản ngân hàng" } as const;

export function OrdersScreen({ navigation }: RootScreenProps<"Orders">) {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByUser(user.id);
      setOrders([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <FlatList
      data={orders}
      keyExtractor={(order) => String(order.id)}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState
          emoji="🧾"
          title="Bạn chưa có đơn hàng nào"
          message="Đặt đơn đầu tiên để theo dõi tại đây."
          actionLabel="Mua sắm ngay"
          onAction={() => navigation.navigate("Tabs", { screen: "Home" })}
        />
      }
      renderItem={({ item: order }) => {
        const open = openId === order.id;
        return (
          <View style={styles.card}>
            <Pressable onPress={() => setOpenId(open ? null : order.id)} style={styles.head}>
              <View style={styles.info}>
                <Text style={styles.code}>Đơn #{order.id}</Text>
                <Text style={styles.date}>{formatDateTime(order.createdAt)}</Text>
                <Text style={styles.total}>{formatPrice(order.total)}</Text>
              </View>
              <View style={styles.right}>
                <StatusBadge status={order.status} />
                <Text style={styles.toggle}>{open ? "Thu gọn ▲" : "Chi tiết ▼"}</Text>
              </View>
            </Pressable>
            {open && (
              <View style={styles.detail}>
                {order.items.map((item) => (
                  <View key={item.bookId} style={styles.itemRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{item.title} × {item.quantity}</Text>
                    <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                  </View>
                ))}
                <View style={styles.address}>
                  <Text style={styles.addressHeading}>Giao đến</Text>
                  <Text style={styles.addressText}>{order.address.name} · {order.address.phone}</Text>
                  <Text style={styles.addressText}>{order.address.address}</Text>
                  <Text style={styles.addressText}>Thanh toán: {PAYMENT_LABEL[order.paymentMethod]}</Text>
                </View>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 10, flexGrow: 1, backgroundColor: colors.bg },
  card: { backgroundColor: "#fff", borderRadius: radius.md, overflow: "hidden" },
  head: { flexDirection: "row", justifyContent: "space-between", gap: 12, padding: 14 },
  info: { flex: 1, gap: 2 },
  right: { alignItems: "flex-end", gap: 6 },
  code: { fontWeight: "800", color: colors.navy, fontSize: 16 },
  date: { color: colors.muted, fontSize: 12 },
  total: { fontWeight: "800", color: colors.indigo, marginTop: 2 },
  toggle: { color: colors.indigo, fontSize: 12, fontWeight: "700" },
  detail: { borderTopWidth: 1, borderTopColor: colors.line, padding: 14, gap: 8 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { fontWeight: "700", color: colors.text },
  address: { marginTop: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line, gap: 2 },
  addressHeading: { fontWeight: "800", color: colors.navy },
  addressText: { color: colors.muted },
});
