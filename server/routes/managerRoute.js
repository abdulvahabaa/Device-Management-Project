import express from "express";
import { adminLogin, getDammageinfo } from "../controllers/manger.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";

const router = express.Router();

// router.post("/signup", signup);

router.post("/login", adminLogin);


router.get("/dammgaeinfo",verifyAdminToken,getDammageinfo)


// router.get("/logout",logout)

export default router;