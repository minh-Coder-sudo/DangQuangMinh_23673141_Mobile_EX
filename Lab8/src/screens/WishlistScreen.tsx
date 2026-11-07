import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { BookGrid } from "../components/BookGrid";
import { EmptyState } from "../components/EmptyState";
import { ErrorView } from "../components/ErrorView";
import { LoadingView } from "../components/LoadingView";
import { getErrorMessage } from "../api/client";
import { RootScreenProps } from "../navigation/types";
import { getBooks } from "../services/bookService";
import { useWishlist } from "../store/hooks";
import { Book } from "../types";
import { colors } from "../theme";

export function WishlistScreen({ navigation }: RootScreenProps<"Wishlist">) {
  const { ids } = useWishlist();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBooks(await getBooks());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const favorites = useMemo(() => books.filter((book) => ids.includes(book.id)), [books, ids]);
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BookGrid
        data={favorites}
        onPressBook={(book) => navigation.navigate("BookDetail", { bookId: book.id })}
        ListEmptyComponent={<EmptyState emoji="💔" title="Chưa có sách yêu thích" message="Nhấn ♡ trên mỗi cuốn sách để lưu lại ở đây." actionLabel="Khám phá sách" onAction={() => navigation.navigate("Tabs", { screen: "Home" })} />}
      />
    </View>
  );
}
