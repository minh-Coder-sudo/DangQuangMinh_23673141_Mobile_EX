import { api } from "../api/client";
import { Review } from "../types";

export type NewReview = Omit<Review, "id" | "createdAt">;

export async function getReviews(bookId: number): Promise<Review[]> {
  const response = await api.get<Review[]>("/reviews", { params: { bookId, _sort: "createdAt", _order: "desc" } });
  return response.data;
}

export async function addReview(payload: NewReview): Promise<Review> {
  const response = await api.post<Review>("/reviews", { ...payload, createdAt: new Date().toISOString() });
  return response.data;
}
