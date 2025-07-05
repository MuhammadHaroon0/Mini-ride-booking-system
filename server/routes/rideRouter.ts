import express from "express";
import { changeRideStatus, createRide, getRide, getRideHistory } from "../controllers/rideController";
import { protect, restriction } from "../controllers/authController";

const router = express.Router();

router.route('/')
    .post(protect, restriction("customer"), createRide)

router.patch('/approve-listing/:id', protect, changeRideStatus)
router.get('/history', protect, getRideHistory)

router.route('/:id')
    .get(protect, getRide)

export default router;
