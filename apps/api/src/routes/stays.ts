import { Router } from "express";
import { createReviewSchema, staySearchQuerySchema } from "@lodgical/shared";
import {
  addReview,
  getStayById,
  listReviewsForStay,
  listStays,
} from "../data/store";
import { NotFoundError } from "../middleware/errors";

export const staysRouter = Router();

staysRouter.get("/", (req, res, next) => {
  try {
    const query = staySearchQuerySchema.parse(req.query);
    res.json(listStays(query));
  } catch (error) {
    next(error);
  }
});

staysRouter.get("/:id", (req, res, next) => {
  const stay = getStayById(req.params.id);
  if (!stay) {
    next(new NotFoundError(`Stay ${req.params.id} not found`));
    return;
  }
  res.json(stay);
});

staysRouter.get("/:id/reviews", (req, res, next) => {
  const stay = getStayById(req.params.id);
  if (!stay) {
    next(new NotFoundError(`Stay ${req.params.id} not found`));
    return;
  }
  res.json(listReviewsForStay(req.params.id));
});

staysRouter.post("/:id/reviews", (req, res, next) => {
  try {
    const stay = getStayById(req.params.id);
    if (!stay) {
      next(new NotFoundError(`Stay ${req.params.id} not found`));
      return;
    }
    const input = createReviewSchema.parse(req.body);
    const review = addReview(req.params.id, input);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});
