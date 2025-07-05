import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import sanitize from "sanitize";
import AppError from "./utils/AppError";
import globalErrorHandler from "./controllers/errorController";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,

}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}
app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 45 * 60 * 1000, // 45 minutes
  max: 100,
  message: "Too many requests sent. Please try again in 45 minutes",
});
if (process.env.NODE_ENV === 'production') {
  app.use("/api/v1/users/", limiter);
}

// Preventing XSS Attacks
app.use(sanitize.middleware);

// Preventing Parameter Pollution
app.use(
  hpp({
    whitelist: [], // Define allowed parameters here if needed
  })
);

import userRouter from './routes/userRouter'
import rideRouter from './routes/rideRouter'
// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rides", rideRouter);


app.get("/", async (req: Request, res: Response) => {
  res.send("Hello there");

});

// Handling Undefined Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Couldn't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
