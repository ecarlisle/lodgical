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

export const staySearchQuerySchema = z.object({
  location: z.string().optional(),
  guests: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export type StaySearchQuery = z.infer<typeof staySearchQuerySchema>;
