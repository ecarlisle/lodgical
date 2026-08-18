import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";

const app = createApp();

async function createConfirmedBooking(
  stayId: string,
  checkIn: string,
  checkOut: string,
) {
  const response = await request(app).post("/bookings").send({
    stayId,
    guestName: "Ada Lovelace",
    email: "ada@example.com",
    checkIn,
    checkOut,
    guests: 1,
  });

  expect(response.status).toBe(201);
}

describe("POST /bookings", () => {
  it("creates a booking and computes the total price", async () => {
    const response = await request(app).post("/bookings").send({
      stayId: "stay-1",
      guestName: "Ada Lovelace",
      email: "ada@example.com",
      checkIn: "2026-09-01",
      checkOut: "2026-09-04",
      guests: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("confirmed");
    expect(response.body.totalPrice).toBe(3 * 120);
  });

  it("rejects a booking that overlaps a confirmed booking", async () => {
    await createConfirmedBooking("stay-2", "2026-10-01", "2026-10-04");

    const response = await request(app).post("/bookings").send({
      stayId: "stay-2",
      guestName: "Grace Hopper",
      email: "grace@example.com",
      checkIn: "2026-10-02",
      checkOut: "2026-10-05",
      guests: 1,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/not available/i);
  });

  it("allows a booking that starts on an earlier booking's checkout date", async () => {
    await createConfirmedBooking("stay-3", "2026-11-01", "2026-11-04");

    const response = await request(app).post("/bookings").send({
      stayId: "stay-3",
      guestName: "Grace Hopper",
      email: "grace@example.com",
      checkIn: "2026-11-04",
      checkOut: "2026-11-06",
      guests: 1,
    });

    expect(response.status).toBe(201);
  });

  it("rejects a checkout before check-in", async () => {
    const response = await request(app).post("/bookings").send({
      stayId: "stay-1",
      guestName: "Ada Lovelace",
      email: "ada@example.com",
      checkIn: "2026-09-04",
      checkOut: "2026-09-01",
      guests: 2,
    });

    expect(response.status).toBe(400);
  });

  it("returns 404 for an unknown stay", async () => {
    const response = await request(app).post("/bookings").send({
      stayId: "does-not-exist",
      guestName: "Ada Lovelace",
      email: "ada@example.com",
      checkIn: "2026-09-01",
      checkOut: "2026-09-04",
      guests: 2,
    });

    expect(response.status).toBe(404);
  });
});

describe("GET /bookings/:id", () => {
  it("returns 404 for an unknown booking", async () => {
    const response = await request(app).get("/bookings/does-not-exist");
    expect(response.status).toBe(404);
  });
});
