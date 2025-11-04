import express from "express";
import { CheckIn, CheckOut, DeletePresensi, updatePresensi } from "../controllers/presensiController.js";
import { addUserData } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.use(addUserData);
router.post("/check-in", CheckIn);
router.post("/check-out", CheckOut);
router.put("/:id",updatePresensi);
router.delete("/:id", DeletePresensi);

export default router;
