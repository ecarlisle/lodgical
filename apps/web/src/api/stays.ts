import type {
  Booking,
  CreateBookingInput,
  CreateReviewInput,
  Review,
  Stay,
  StaySearchQuery,
} from "@lodgical/shared";
import { apiRequest } from "./client";

export function fetchStays(query: StaySearchQuery = {}): Promise<Stay[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const qs = params.toString();
  return apiRequest<Stay[]>(`/stays${qs ? `?${qs}` : ""}`);
}

export function fetchStay(id: string): Promise<Stay> {
  return apiRequest<Stay>(`/stays/${id}`);
}

export function fetchReviews(stayId: string): Promise<Review[]> {
  return apiRequest<Review[]>(`/stays/${stayId}/reviews`);
}

export function createReview(
  stayId: string,
  input: CreateReviewInput,
): Promise<Review> {
  return apiRequest<Review>(`/stays/${stayId}/reviews`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createBooking(input: CreateBookingInput): Promise<Booking> {
  return apiRequest<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchBooking(id: string): Promise<Booking> {
  return apiRequest<Booking>(`/bookings/${id}`);
}
