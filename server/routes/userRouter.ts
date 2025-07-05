import express from "express";
const router = express.Router();
import { login, protect, signUp, logout, getMe } from "../controllers/authController";

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-me", protect, getMe);

export default router;
