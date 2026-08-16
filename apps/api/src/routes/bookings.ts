import { Router } from "express";
import { createBookingSchema } from "@lodgical/shared";
import { createBooking, getBookingById } from "../data/store";
import { NotFoundError } from "../middleware/errors";

export const bookingsRouter = Router();

bookingsRouter.post("/", (req, res, next) => {
  try {
    const input = createBookingSchema.parse(req.body);
    const booking = createBooking(input);
    if (!booking) {
      next(new NotFoundError(`Stay ${input.stayId} not found`));
      return;
    }
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

bookingsRouter.get("/:id", (req, res, next) => {
  const booking = getBookingById(req.params.id);
  if (!booking) {
    next(new NotFoundError(`Booking ${req.params.id} not found`));
    return;
  }
  res.json(booking);
});
