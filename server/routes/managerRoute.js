import express from "express";
import { adminLogin, getDammageinfo } from "../controllers/manger.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";
import { verifyToken } from "../middleware/engineerAuth.js";

const router = express.Router();

router.post("/login", adminLogin);

// router.get("/home")

router.get("/dammageinfo",verifyToken, getDammageinfo);

// router.get("/logout",logout)

export default router;
