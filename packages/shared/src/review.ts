import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string(),
  stayId: z.string(),
  author: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof reviewSchema>;

export const createReviewSchema = reviewSchema.pick({
  author: true,
  rating: true,
  comment: true,
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
