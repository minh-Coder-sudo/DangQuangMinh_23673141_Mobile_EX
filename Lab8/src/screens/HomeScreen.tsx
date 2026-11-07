import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { PriceFilter } from "../components/PriceFilter";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../api/client";
import { useDebounce } from "../hooks/useDebounce";
import { filterBooks, PriceRange } from "../utils/filters";
import { useCart } from "../store/hooks";
import { TabScreenProps } from "../navigation/types";
import { colors } from "../theme";
import { Book, Category } from "../types";

type SortOrder = "asc" | "desc" | null;

export function HomeScreen({ navigation, route }: TabScreenProps<"Home">) {
  const { totalQuantity } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookData, categoryData] = await Promise.all([getBooks(), getCategories()]);
      setBooks(bookData);
      setCategories(categoryData);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const debouncedKeyword = useDebounce(keyword, 400);
  const visibleBooks = useMemo(() => {
    const filtered = filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange });
    if (sortOrder === null) return filtered;
    return [...filtered].sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);
  }, [books, debouncedKeyword, categoryId, priceRange, sortOrder]);

  useEffect(() => {
    const id = route.params?.categoryId;
    if (id !== undefined) {
      setCategoryId(id);
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId, navigation]);

  const clearFilters = () => {
    setKeyword("");
    setCategoryId(null);
    setPriceRange(null);
    setSortOrder(null);
  };
  const hasFilter = keyword !== "" || categoryId !== null || priceRange !== null || sortOrder !== null;

  if (loading) return <LoadingView label="Đang tải sách…" />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <Header title="📚 BookStore" onSearchPress={() => setSearchOpen((v) => !v)} />
      {searchOpen && (
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          onClose={() => {
            setSearchOpen(false);
            setKeyword("");
          }}
        />
      )}
      <BookGrid
        data={visibleBooks}
        onPressBook={(book) => navigation.navigate("BookDetail", { bookId: book.id })}
        ListHeaderComponent={
          <View>
            <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
            <PriceFilter value={priceRange} onChange={setPriceRange} />
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Sắp xếp:</Text>
              <Pressable style={[styles.sortButton, sortOrder === "asc" && styles.sortButtonActive]} onPress={() => setSortOrder(sortOrder === "asc" ? null : "asc")}>
                <Text style={[styles.sortText, sortOrder === "asc" && styles.sortTextActive]}>Giá tăng dần</Text>
              </Pressable>
              <Pressable style={[styles.sortButton, sortOrder === "desc" && styles.sortButtonActive]} onPress={() => setSortOrder(sortOrder === "desc" ? null : "desc")}>
                <Text style={[styles.sortText, sortOrder === "desc" && styles.sortTextActive]}>Giá giảm dần</Text>
              </Pressable>
            </View>
            {hasFilter && (
              <Pressable onPress={clearFilters} style={styles.clearButton}>
                <Text style={styles.clearText}>✕ Xóa bộ lọc</Text>
              </Pressable>
            )}
          </View>
        }
        ListEmptyComponent={<EmptyState emoji="🔎" title="Không tìm thấy sách phù hợp" message="Hãy thử từ khoá khác hoặc bỏ bớt bộ lọc." actionLabel="Xóa bộ lọc" onAction={clearFilters} />}
      />
      <FloatingCartButton count={totalQuantity} onPress={() => navigation.navigate("Cart")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  sortRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, paddingHorizontal: 12, paddingBottom: 10 },
  sortLabel: { color: colors.muted, fontWeight: "700" },
  sortButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  sortButtonActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  sortText: { color: colors.text, fontWeight: "600" },
  sortTextActive: { color: "#fff" },
  clearButton: { alignSelf: "flex-end", marginRight: 12, marginBottom: 8 },
  clearText: { color: colors.indigo, fontWeight: "700" },
});
