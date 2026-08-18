import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";

const app = createApp();

describe("GET /stays", () => {
  it("returns the seeded list of stays", async () => {
    const response = await request(app).get("/stays");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("filters by location", async () => {
    const response = await request(app)
      .get("/stays")
      .query({ location: "Lisbon" });
    expect(response.status).toBe(200);
    expect(
      response.body.every((stay: { location: string }) =>
        stay.location.toLowerCase().includes("lisbon"),
      ),
    ).toBe(true);
  });

  it("filters out stays booked during the requested date range", async () => {
    const booking = await request(app).post("/bookings").send({
      stayId: "stay-2",
      guestName: "Katherine Johnson",
      email: "katherine@example.com",
      checkIn: "2026-10-10",
      checkOut: "2026-10-14",
      guests: 1,
    });
    expect(booking.status).toBe(201);

    const response = await request(app).get("/stays").query({
      checkIn: "2026-10-12",
      checkOut: "2026-10-16",
    });

    expect(response.status).toBe(200);
    expect(
      response.body.some((stay: { id: string }) => stay.id === "stay-2"),
    ).toBe(false);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("requires a complete, ordered date range", async () => {
    const partial = await request(app)
      .get("/stays")
      .query({ checkIn: "2026-10-10" });
    const reversed = await request(app).get("/stays").query({
      checkIn: "2026-10-14",
      checkOut: "2026-10-10",
    });

    expect(partial.status).toBe(400);
    expect(reversed.status).toBe(400);
  });
});

describe("GET /stays/:id", () => {
  it("returns 404 for an unknown stay", async () => {
    const response = await request(app).get("/stays/does-not-exist");
    expect(response.status).toBe(404);
  });

  it("returns the stay for a known id", async () => {
    const response = await request(app).get("/stays/stay-1");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("stay-1");
  });
});

describe("POST /stays/:id/reviews", () => {
  it("adds a review and reflects it in the review list", async () => {
    const response = await request(app).post("/stays/stay-2/reviews").send({
      author: "Test User",
      rating: 5,
      comment: "Great stay!",
    });
    expect(response.status).toBe(201);

    const reviews = await request(app).get("/stays/stay-2/reviews");
    expect(
      reviews.body.some(
        (review: { comment: string }) => review.comment === "Great stay!",
      ),
    ).toBe(true);
  });

  it("rejects an invalid review payload", async () => {
    const response = await request(app).post("/stays/stay-2/reviews").send({
      author: "",
      rating: 10,
      comment: "",
    });
    expect(response.status).toBe(400);
  });
});
