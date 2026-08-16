import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Stay } from "@lodgical/shared";
import { StayCard } from "./StayCard";

const stay: Stay = {
  id: "1",
  title: "Seaside Cottage",
  location: "Lisbon, Portugal",
  description: "A cozy cottage by the sea.",
  images: ["https://example.com/image.jpg"],
  pricePerNight: 120,
  maxGuests: 4,
  amenities: ["Wifi"],
  rating: 4.5,
  reviewCount: 12,
};

describe("StayCard", () => {
  it("renders stay title, location, and price", () => {
    render(
      <MemoryRouter>
        <StayCard stay={stay} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Seaside Cottage")).toBeInTheDocument();
    expect(screen.getByText("Lisbon, Portugal")).toBeInTheDocument();
    expect(screen.getByText("$120")).toBeInTheDocument();
  });

  it("links to the stay detail page", () => {
    render(
      <MemoryRouter>
        <StayCard stay={stay} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/stays/1");
  });
});
