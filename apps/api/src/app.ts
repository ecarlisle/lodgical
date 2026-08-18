import express from "express";
import cors from "cors";
import { staysRouter } from "./routes/stays";
import { bookingsRouter } from "./routes/bookings";
import { errorHandler } from "./middleware/errors";

export function createApp(basePath = "") {
  const app = express();
  const route = (path: string) => `${basePath}${path}`;

  app.use(cors());
  app.use(express.json());

  app.get(route("/health"), (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(route("/stays"), staysRouter);
  app.use(route("/bookings"), bookingsRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use(errorHandler);

  return app;
}
