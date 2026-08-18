import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Review, Stay } from "@lodgical/shared";
import { createReview, fetchReviews, fetchStay } from "../api/stays";
import { StayDetailPage } from "./StayDetailPage";

vi.mock("../api/stays", () => ({
  createReview: vi.fn(),
  fetchReviews: vi.fn(),
  fetchStay: vi.fn(),
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
  reviewCount: 1,
};

const existingReview: Review = {
  id: "review-1",
  stayId: stay.id,
  author: "Maria",
  rating: 5,
  comment: "Wonderful stay.",
  createdAt: "2026-08-10T12:00:00.000Z",
};

const submittedReview: Review = {
  id: "review-2",
  stayId: stay.id,
  author: "Ada",
  rating: 4,
  comment: "A peaceful weekend by the water.",
  createdAt: "2026-08-18T12:00:00.000Z",
};

function renderStayDetail() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/stays/${stay.id}`]}>
        <Routes>
          <Route path="/stays/:id" element={<StayDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function completeReviewForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), submittedReview.author);
  await user.selectOptions(
    screen.getByLabelText("Rating"),
    String(submittedReview.rating),
  );
  await user.type(screen.getByLabelText("Comment"), submittedReview.comment);
  await user.click(screen.getByRole("button", { name: "Submit review" }));
}

describe("StayDetailPage reviews", () => {
  beforeEach(() => {
    vi.mocked(fetchStay).mockResolvedValue(stay);
    vi.mocked(fetchReviews).mockResolvedValue([existingReview]);
  });

  it("submits a review, refreshes the list, and resets the form", async () => {
    const user = userEvent.setup();
    vi.mocked(createReview).mockResolvedValue(submittedReview);
    vi.mocked(fetchReviews)
      .mockResolvedValueOnce([existingReview])
      .mockResolvedValue([existingReview, submittedReview]);
    renderStayDetail();

    expect(
      await screen.findByRole("heading", { name: stay.title }),
    ).toBeInTheDocument();
    await completeReviewForm(user);

    expect(createReview).toHaveBeenCalledWith(stay.id, {
      author: submittedReview.author,
      rating: submittedReview.rating,
      comment: submittedReview.comment,
    });
    expect(
      await screen.findByText(submittedReview.comment),
    ).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue(""));
    expect(screen.getByLabelText("Comment")).toHaveValue("");
  });

  it("keeps the form values and shows an error when submission fails", async () => {
    const user = userEvent.setup();
    vi.mocked(createReview).mockRejectedValue(new Error("API unavailable"));
    renderStayDetail();

    await screen.findByRole("heading", { name: stay.title });
    await completeReviewForm(user);

    expect(
      await screen.findByText("Couldn't submit your review. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue(submittedReview.author);
    expect(screen.getByLabelText("Comment")).toHaveValue(
      submittedReview.comment,
    );
  });

  it("shows a loading state while reviews are being fetched", async () => {
    vi.mocked(fetchReviews).mockReturnValue(new Promise(() => undefined));
    renderStayDetail();

    await screen.findByRole("heading", { name: stay.title });
    expect(screen.getByText("Loading reviews…")).toBeInTheDocument();
  });

  it("shows an empty state when the stay has no reviews", async () => {
    vi.mocked(fetchReviews).mockResolvedValue([]);
    renderStayDetail();

    expect(
      await screen.findByText("No reviews yet. Be the first to write one."),
    ).toBeInTheDocument();
  });

  it("shows an error state when reviews cannot be loaded", async () => {
    vi.mocked(fetchReviews).mockRejectedValue(new Error("API unavailable"));
    renderStayDetail();

    expect(
      await screen.findByText("Couldn't load reviews."),
    ).toBeInTheDocument();
  });
});
