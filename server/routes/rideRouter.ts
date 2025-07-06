import express from "express";
import { changeRideStatus, createRide, getRide, getRideHistory, getRidesByStatus, getRidesByZone } from "../controllers/rideController";
import { protect, restriction } from "../controllers/authController";

const router = express.Router();

router.route('/')
    .post(protect, restriction("customer"), createRide)

router.patch('/change-status/:id', protect, changeRideStatus)
router.get('/history', protect, getRideHistory)
router.post('/zone', protect, getRidesByZone)
router.post('/status', protect, getRidesByStatus)

router.route('/:id')
    .get(protect, getRide)

export default router;
