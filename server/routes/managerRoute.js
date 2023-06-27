import express from "express";
import { adminLogin, getDammageinfo } from "../controllers/manger.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);

router.get("/dammageinfo",getDammageinfo)


// router.get("/logout",logout)

export default router;