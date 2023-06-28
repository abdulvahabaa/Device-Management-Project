import express from "express";
import { getEngineer } from "../controllers/engineers.js";
import { verifyToken } from "../middleware/engineerAuth.js";

const router = express.Router();

// READ
router.get("/:id", verifyToken, getEngineer);

export default router;
