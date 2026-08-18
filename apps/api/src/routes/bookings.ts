import { Router } from "express";
import { createBookingSchema } from "@lodgical/shared";
import { createBooking, getBookingById } from "../data/store";
import { ConflictError, NotFoundError } from "../middleware/errors";

export const bookingsRouter = Router();

bookingsRouter.post("/", (req, res, next) => {
  try {
    const input = createBookingSchema.parse(req.body);
    const result = createBooking(input);
    if (result.status === "not-found") {
      next(new NotFoundError(`Stay ${input.stayId} not found`));
      return;
    }
    if (result.status === "conflict") {
      next(
        new ConflictError(
          "This stay is not available for the selected dates. Choose another date range.",
        ),
      );
      return;
    }
    res.status(201).json(result.booking);
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
