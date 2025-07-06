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
        .populate("user", "name email").populate("driver", "name email");

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

export const getRidesByZone = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const { zone } = req.body

    const doc = await RideModel.find({ pickupLocation: { $in: zone }, status: "requested", rejectedBy: { $ne: req.user.id } }).populate("user", "name email");

    return res.status(201).json({ status: "success", doc });
});

export const changeRideStatus = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const { status } = req.body
    let doc
    if (status === "accepted")
        doc = await RideModel.findByIdAndUpdate(req.params.id, { status: "accepted", driver: req.user.id });
    else if (status === "rejected")
        doc = await RideModel.findByIdAndUpdate(req.params.id, { $addToSet: { rejectedBy: req.user.id } });
    else
        doc = await RideModel.findByIdAndUpdate(req.params.id, { status: status });

    if (!doc) {
        return next(new AppError("Doc not found matching this id!", 404));
    }

    return res.status(201).json({ status: "success", doc });
});

export const getRidesByStatus = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const { status } = req.body
    const doc = await RideModel.find({ status: status, driver: req.user.id }).populate("user", "name email");;

    if (!doc) {
        return next(new AppError("Doc not found matching this id!", 404));
    }

    return res.status(201).json({ status: "success", doc });
});

