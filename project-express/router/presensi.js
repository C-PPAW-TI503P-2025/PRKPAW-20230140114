import express from "express";
import { CheckIn, CheckOut } from "../controllers/presensiController.js";
import { addUserData } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.use(addUserData);


router.post("/check-in", CheckIn);
router.post("/check-out", CheckOut);

export default router;
