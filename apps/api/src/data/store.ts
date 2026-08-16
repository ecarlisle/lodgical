import { randomUUID } from "node:crypto";
import type {
  Booking,
  CreateBookingInput,
  CreateReviewInput,
  Review,
  Stay,
  StaySearchQuery,
} from "@lodgical/shared";
import { seedReviews, seedStays } from "./seed";

type StayRecord = Omit<Stay, "rating" | "reviewCount">;

const stays: StayRecord[] = seedStays.map((stay) => ({ ...stay }));
const reviews: Review[] = seedReviews.map((review) => ({ ...review }));
const bookings: Booking[] = [];

function ratingFor(stayId: string): { rating: number; reviewCount: number } {
  const stayReviews = reviews.filter((review) => review.stayId === stayId);
  if (stayReviews.length === 0) return { rating: 0, reviewCount: 0 };
  const sum = stayReviews.reduce((total, review) => total + review.rating, 0);
  return {
    rating: Math.round((sum / stayReviews.length) * 10) / 10,
    reviewCount: stayReviews.length,
  };
}

function toStay(record: StayRecord): Stay {
  return { ...record, ...ratingFor(record.id) };
}

export function listStays(query: StaySearchQuery): Stay[] {
  return stays
    .filter((stay) =>
      query.location
        ? stay.location.toLowerCase().includes(query.location.toLowerCase())
        : true,
    )
    .filter((stay) => (query.guests ? stay.maxGuests >= query.guests : true))
    .filter((stay) =>
      query.minPrice !== undefined ? stay.pricePerNight >= query.minPrice : true,
    )
    .filter((stay) =>
      query.maxPrice !== undefined ? stay.pricePerNight <= query.maxPrice : true,
    )
    .map(toStay);
}

export function getStayById(id: string): Stay | undefined {
  const record = stays.find((stay) => stay.id === id);
  return record ? toStay(record) : undefined;
}

export function listReviewsForStay(stayId: string): Review[] {
  return reviews
    .filter((review) => review.stayId === stayId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReview(stayId: string, input: CreateReviewInput): Review {
  const review: Review = {
    id: randomUUID(),
    stayId,
    author: input.author,
    rating: input.rating,
    comment: input.comment,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  return review;
}

export function createBooking(input: CreateBookingInput): Booking | undefined {
  const stay = getStayById(input.stayId);
  if (!stay) return undefined;

  const nights = Math.round(
    (new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const booking: Booking = {
    id: randomUUID(),
    stayId: input.stayId,
    guestName: input.guestName,
    email: input.email,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    totalPrice: nights * stay.pricePerNight,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((booking) => booking.id === id);
}
