import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { NotificationItem } from "../components/NotificationItem";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getNotifications, markAsRead } from "../services/notificationService";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { AppNotification } from "../types";
import { colors } from "../theme";

export function NotificationsScreen({ navigation }: RootScreenProps<"Notifications">) {
  const { user, isLoggedIn } = useAuth();
  const [data, setData] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      setData(await getNotifications(user.id));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = (notification: AppNotification) => {
    if (!notification.read) {
      setData((previous) => previous.map((item) => (item.id === notification.id ? { ...item, read: true } : item)));
      markAsRead(notification.id).catch(() => {
        setData((previous) => previous.map((item) => (item.id === notification.id ? { ...item, read: false } : item)));
      });
    }

    if (notification.target?.screen === "Orders") {
      navigation.navigate("Orders");
    } else if (notification.target?.screen === "BookDetail" && notification.target.bookId) {
      navigation.navigate("BookDetail", { bookId: notification.target.bookId });
    }
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <FlatList
      data={data}
      keyExtractor={(notification) => String(notification.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <NotificationItem item={item} onPress={open} />}
      ListEmptyComponent={<EmptyState emoji="🔔" title="Chưa có thông báo nào" />}
    />
  );
}

const styles = StyleSheet.create({ list: { padding: 12, gap: 8, flexGrow: 1, backgroundColor: colors.bg } });
