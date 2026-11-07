import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBookById } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useAuth, useCart } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { Book, Review } from "../types";
import { colors, formatPrice, radius } from "../theme";
import { getReviews, addReview } from "../services/reviewService";
import { RatingStars } from "../components/RatingStars";
import { HeartButton } from "../components/HeartButton";
import { PrimaryButton } from "../components/PrimaryButton";

// gọi getBookById thay cho mảng tĩnh; có loading + lỗi + thử lại
export function BookDetailScreen({ route }: RootScreenProps<"BookDetail">) {
  const { bookId } = route.params;
  const { add } = useCart();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookData, reviewData] = await Promise.all([getBookById(bookId), getReviews(bookId)]);
      setBook(bookData);
      setReviews(reviewData);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void load();
  }, [load]);

  const average = useMemo(
    () => reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
    [reviews],
  );

  const submitReview = async () => {
    if (!user) return;
    if (rating === 0) return setFormError("Vui lòng chọn số sao");
    if (!comment.trim()) return setFormError("Vui lòng nhập bình luận");
    setFormError(null);
    setSending(true);
    try {
      const created = await addReview({ bookId, userId: user.id, userName: user.name, rating, comment: comment.trim() });
      setReviews((previous) => [created, ...previous]);
      setRating(0);
      setComment("");
    } catch (submitError) {
      setFormError(getErrorMessage(submitError));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingView />;
  if (error || !book) return <ErrorView message={error ?? "Không tìm thấy sách."} onRetry={load} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.cover, { backgroundColor: book.color }]}>
        <Text style={styles.emoji}>{book.emoji}</Text>
      </View>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.price}>{formatPrice(book.price)}</Text>
      <Text style={styles.stock}>Còn {book.stock} cuốn</Text>
      <Text style={styles.desc}>{book.description}</Text>
      <View style={styles.ratingRow}>
        <RatingStars value={average} size={22} />
        <Text style={styles.ratingText}>{average.toFixed(1)} ({reviews.length} đánh giá)</Text>
      </View>
      <HeartButton bookId={book.id} style={styles.favorite} />
      <Pressable style={styles.btn} onPress={() => add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock })}>
        <Text style={styles.btnText}>Thêm vào giỏ</Text>
      </Pressable>
      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Đánh giá</Text>
        {user ? (
          <View style={styles.reviewForm}>
            <Text style={styles.formLabel}>Chọn số sao</Text>
            <RatingStars value={rating} size={30} onChange={setRating} />
            <TextInput value={comment} onChangeText={setComment} placeholder="Viết bình luận của bạn" placeholderTextColor={colors.muted} multiline style={styles.commentInput} />
            {formError ? <Text style={styles.formError}>{formError}</Text> : null}
            <PrimaryButton title="Gửi đánh giá" onPress={submitReview} loading={sending} />
          </View>
        ) : <Text style={styles.loginHint}>Đăng nhập để viết đánh giá</Text>}
        {reviews.map((review) => (
          <View key={review.id} style={styles.review}>
            <View style={styles.reviewHeader}><Text style={styles.reviewer}>{review.userName}</Text><RatingStars value={review.rating} /></View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 8 },
  cover: { height: 220, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 90 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, marginTop: 8 },
  author: { color: colors.muted, fontSize: 15 },
  price: { fontSize: 20, fontWeight: "800", color: colors.indigo },
  stock: { color: colors.muted },
  desc: { color: colors.text, lineHeight: 22, marginTop: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5 },
  ratingText: { color: colors.muted, fontWeight: "700" },
  favorite: { position: "absolute", right: 22, top: 197, backgroundColor: "#fff", borderRadius: radius.pill, width: 42, height: 42, elevation: 2 },
  btn: { backgroundColor: colors.indigo, padding: 14, borderRadius: radius.md, alignItems: "center", marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  reviewSection: { marginTop: 18, gap: 10 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: colors.navy },
  reviewForm: { backgroundColor: "#fff", borderRadius: radius.md, padding: 12, gap: 9 },
  formLabel: { color: colors.text, fontWeight: "700" },
  commentInput: { minHeight: 82, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, padding: 10, color: colors.text, textAlignVertical: "top" },
  formError: { color: colors.danger },
  loginHint: { color: colors.muted, backgroundColor: "#fff", borderRadius: radius.md, padding: 13 },
  review: { backgroundColor: "#fff", borderRadius: radius.md, padding: 12, gap: 5 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewer: { color: colors.text, fontWeight: "800" },
  reviewComment: { color: colors.text, lineHeight: 20 },
});
