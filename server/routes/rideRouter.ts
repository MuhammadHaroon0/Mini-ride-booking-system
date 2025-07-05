import express from "express";
import { changeRideStatus, createRide, getRide } from "../controllers/rideController";
import { protect, restriction } from "../controllers/authController";

const router = express.Router();

router.route('/')
    .post(protect, restriction("customer"), createRide)

router.patch('/approve-listing/:id', protect, changeRideStatus)

router.route('/:id')
    .get(getRide)

export default router;
