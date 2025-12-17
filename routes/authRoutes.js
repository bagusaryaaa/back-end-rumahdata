import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
