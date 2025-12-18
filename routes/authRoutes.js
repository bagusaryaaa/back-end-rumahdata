import express from "express";
import {
  register,
  login,
  logout,
  approveUser,
} from "../controllers/authController.js";


const router = express.Router();

// ===================
// PUBLIC ROUTES
// ===================
router.post("/register", register);
router.post("/login", login);

// ===================
// PROTECTED ROUTES
// ===================
router.post("/logout", logout);

// ===================
// SUPERADMIN ONLY
// ===================
router.post(
  "/approve",
  approveUser
);

export default router;
