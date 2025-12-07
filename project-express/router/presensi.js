import express from "express";
import { 
  CheckIn, 
  CheckOut, 
  DeletePresensi, 
  GetDailyReports, 
  upload 
} from "../controllers/presensiController.js";

import { authenticateToken, isAdmin } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// ========== CHECK-IN dengan upload foto ==========
router.post(
  "/check-in",
  authenticateToken,
  upload.single("image"),   // <<< tambahkan upload foto
  CheckIn
);

// ========== CHECK-OUT ==========
router.post("/check-out", authenticateToken, CheckOut);

// ========== DELETE PRESENSI (admin only) ==========
router.delete("/:id", authenticateToken, isAdmin, DeletePresensi);

// ========== DAILY REPORT ==========
router.get("/daily", authenticateToken, isAdmin, GetDailyReports);

export default router;
