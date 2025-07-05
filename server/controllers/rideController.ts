import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import UserModel from "../models/userModel";
import { AuthenticatedRequest } from "../types/IAuthenticatedRequest";
import RideModel from "../models/rideModel";



export const createRide = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const doc = await RideModel.create({
        ...req.body,
        user: req.user!.id
    });

    await UserModel.findByIdAndUpdate(req.user!.id, {
        $push: { rides: doc._id }
    });

    return res.status(201).json({ status: "success", doc });
});



export const getRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const doc = await RideModel.findOne({ _id: req.params.id })
        .populate("user", "name email phone");

    if (!doc) {
        return next(new AppError("Doc not found matching this id!", 404));
    }
    return res.status(201).json({ status: "success", doc });
});
export const getRideHistory = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const doc = await RideModel.find({ user: req.user.id })
        .populate("driver", "name email");

    return res.status(201).json({ status: "success", doc });
});

export const changeRideStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { status } = req.body
    const doc = await RideModel.findByIdAndUpdate(req.params.id, { status: status });

    if (!doc) {
        return next(new AppError("Doc not found matching this id!", 404));
    }

    return res.status(201).json({ status: "success", doc });
});

