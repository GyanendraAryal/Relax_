import express from "express";
import { getGoogleReviews } from "../controllers/googleReviews.controller.js";

const router = express.Router();

// GET /api/google-reviews
router.get("/", getGoogleReviews);

export default router;