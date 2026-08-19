import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Booking, Stay } from "@lodgical/shared";
import { App } from "../App";
import { createBooking, fetchBooking, fetchStay } from "../api/stays";

vi.mock("../api/stays", () => ({
  createBooking: vi.fn(),
  createReview: vi.fn(),
  fetchBooking: vi.fn(),
  fetchReviews: vi.fn(),
  fetchStay: vi.fn(),
  fetchStays: vi.fn(),
}));

const stay: Stay = {
  id: "stay-1",
  title: "Seaside Cottage",
  location: "Lisbon, Portugal",
  description: "A cottage by the sea.",
  images: ["https://example.com/stay.jpg"],
  pricePerNight: 120,
  maxGuests: 4,
  amenities: ["Wifi"],
  rating: 4.5,
  reviewCount: 2,
};

const booking: Booking = {
  id: "booking-123",
  stayId: stay.id,
  guestName: "Ada Lovelace",
  email: "ada@example.com",
  checkIn: "2026-10-10",
  checkOut: "2026-10-13",
  guests: 2,
  totalPrice: 360,
  status: "confirmed",
  createdAt: "2026-08-18T12:00:00.000Z",
};

function renderCheckout() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[
          "/checkout/stay-1?checkIn=2026-10-10&checkOut=2026-10-13&guests=2",
        ]}
      >
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("checkout journey", () => {
  beforeEach(() => {
    vi.mocked(fetchStay).mockResolvedValue(stay);
    vi.mocked(createBooking).mockResolvedValue(booking);
    vi.mocked(fetchBooking).mockResolvedValue(booking);
  });

  it("submits mocked payment details and renders booking confirmation", async () => {
    const user = userEvent.setup();
    renderCheckout();

    expect(
      await screen.findByRole("heading", { name: "Checkout" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$120 × 3 nights")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Full name"), booking.guestName);
    await user.type(screen.getByLabelText("Email"), booking.email);
    await user.type(
      screen.getByLabelText("Card number"),
      "4242 4242 4242 4242",
    );
    await user.type(screen.getByLabelText("Expiry"), "12/30");
    await user.type(screen.getByLabelText("CVV"), "123");
    await user.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(createBooking).toHaveBeenCalledWith({
      stayId: stay.id,
      guestName: booking.guestName,
      email: booking.email,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
    });
    expect(
      await screen.findByRole("heading", { name: "Booking confirmed" }),
    ).toBeInTheDocument();
    expect(screen.getByText(booking.id)).toBeInTheDocument();
    expect(screen.getByText("$360")).toBeInTheDocument();
    expect(fetchBooking).toHaveBeenCalledWith(booking.id);
  });
});
