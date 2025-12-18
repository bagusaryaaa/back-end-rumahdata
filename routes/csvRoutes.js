import express from "express";
import { getPTK, getSekolah } from "../controllers/csvController.js";

const router = express.Router();

router.get("/ptk", getPTK);
router.get("/sekolah", getSekolah);

export default router;
