import express from "express";
import { CheckIn, CheckOut, DeletePresensi, GetDailyReports } from "../controllers/presensiController.js";
import { authenticateToken, isAdmin } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.post("/check-in", authenticateToken, CheckIn);
router.post("/check-out", authenticateToken, CheckOut);
router.delete("/:id", authenticateToken, isAdmin, DeletePresensi);
router.get("/daily", authenticateToken, isAdmin, GetDailyReports);

export default router;
