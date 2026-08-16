import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string(),
  stayId: z.string(),
  guestName: z.string(),
  email: z.string().email(),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  guests: z.number().int().positive(),
  totalPrice: z.number().positive(),
  status: z.literal("confirmed"),
  createdAt: z.string().datetime(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const createBookingObjectSchema = bookingSchema.pick({
  stayId: true,
  guestName: true,
  email: true,
  checkIn: true,
  checkOut: true,
  guests: true,
});

export const createBookingSchema = createBookingObjectSchema.refine(
  (data) => data.checkOut > data.checkIn,
  {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  },
);

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
