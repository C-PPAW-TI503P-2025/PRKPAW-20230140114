import express from "express";
import { GetDailyReports } from "../controllers/presensiController.js";
import { authenticateToken, isAdmin } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Final endpoint yang benar:
router.get("/daily", authenticateToken, isAdmin, GetDailyReports);

export default router;
