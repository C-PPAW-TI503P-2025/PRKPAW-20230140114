import express from "express";
import { getDailyReport } from "../controllers/reportController.js";
import { checkAdmin } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.use(checkAdmin);
router.get("/daily", getDailyReport);

export default router;
