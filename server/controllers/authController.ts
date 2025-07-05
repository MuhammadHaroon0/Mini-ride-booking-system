import { Request, Response, NextFunction } from 'express';
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "./../utils/catchAsync";
import AppError from "../utils/AppError";
import { signToken } from "../config/jwt";
import { IUser } from '../models/userModel';
import { AuthenticatedRequest } from '../types/IAuthenticatedRequest';

// Extending Express Request interface to include user property
// declare global {
//     namespace Express {
//         interface Request {
//             user?: IUser;
//         }
//     }
// }

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        if (!password || !email) {
            return next(new AppError("Please provide both email and password!", 400));
        }

        const newUser = new UserModel({
            ...req.body,
        });

        await newUser.save();

        res.status(200).json({
            status: "success",
            data: {
                name: newUser.name,
                id: newUser._id,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error("Signup  error:", error);
        return next(new AppError("Something went wrong. Try again later", 500));
    }
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.body.email || !req.body.password) {
        return next(new AppError("Please provide both email and password!", 400));
    }

    const found = await UserModel.findOne({ email: req.body.email }).select("+password");

    if (!found) return next(new AppError("Please provide valid email!", 400));

    if (!(await found.correctPassword(req.body.password))) {
        return next(new AppError("Please provide valid password!", 400));
    }

    signToken(found._id.toString(), res);

    res.status(200).json({
        status: "success",
        user: found
    });
});

export const getMe = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    res.status(200).json({
        status: "success",
        data: {
            email: req.user!.email,
            id: req.user!._id,
            name: req.user!.name,
            role: req.user!.role,
        },
    });
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const cookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const, // <-- Dynamic sameSite
        secure: process.env.NODE_ENV === "production",
        path: '/', // Explicitly set path

    };

    res.clearCookie("jwt", cookieOptions);
    return res.status(200).json({ status: "success", message: "Logout successful" })
})


export const protect = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const token = req.cookies.jwt;

    if (!token) return next(new AppError("Please provide auth token!", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; iat: number };

    const found = await UserModel.findById(decoded.id);

    if (!found) return next(new AppError("User does not exist!", 401));

    req.user = found;
    next();
});

export const restriction = (...roles: IUser['role'][]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("Access denied!", 403));
        }
        next();
    };
};
