import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";

describe("Netlify API mount", () => {
  const app = createApp("/api");

  it("serves API routes below the production prefix", async () => {
    const health = await request(app).get("/api/health");
    const stays = await request(app).get("/api/stays");

    expect(health.status).toBe(200);
    expect(health.body).toEqual({ status: "ok" });
    expect(stays.status).toBe(200);
    expect(stays.body.length).toBeGreaterThan(0);
  });

  it("does not expose unprefixed routes from the function app", async () => {
    const response = await request(app).get("/stays");

    expect(response.status).toBe(404);
  });
});
