import { z } from "zod";

export const staySchema = z.object({
  id: z.string(),
  title: z.string(),
  location: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  pricePerNight: z.number().positive(),
  maxGuests: z.number().int().positive(),
  amenities: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
});

export type Stay = z.infer<typeof staySchema>;

export const staySearchQuerySchema = z
  .object({
    location: z.string().optional(),
    guests: z.coerce.number().int().positive().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    checkIn: z.string().date().optional(),
    checkOut: z.string().date().optional(),
  })
  .superRefine((data, context) => {
    if (data.checkIn && !data.checkOut) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "checkOut is required when checkIn is provided",
        path: ["checkOut"],
      });
    }

    if (data.checkOut && !data.checkIn) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "checkIn is required when checkOut is provided",
        path: ["checkIn"],
      });
    }

    if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "checkOut must be after checkIn",
        path: ["checkOut"],
      });
    }
  });

export type StaySearchQuery = z.infer<typeof staySearchQuerySchema>;
