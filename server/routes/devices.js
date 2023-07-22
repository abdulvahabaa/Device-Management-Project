import express from "express";

import { verifyToken } from "../middleware/engineerAuth.js";
import {
  createDevice,
  deleteDevice,
  forwardToMaintanace,
  getFeedDevices,
  getLive,
  getMaintenance,
  getProduction,
  getUnchecked,
  statusToDammage,
  statusToLive,
  statusToProduction,
  updateDevice,
} from "../controllers/devices.js";

const router = express.Router();

// Create

router.post("/create", verifyToken, createDevice);

// Read

router.get("/feed", verifyToken, getFeedDevices);

router.get("/unchecked", verifyToken, getUnchecked);

router.get("/maintenance", verifyToken, getMaintenance);

router.get("/production", verifyToken, getProduction);

router.get("/live", verifyToken, getLive);

// update

router.patch("/tolive", verifyToken, statusToLive);

router.patch("/toproduction", verifyToken, statusToProduction);

router.patch("/forwardmaitance", verifyToken, forwardToMaintanace);

router.patch("/todammage", verifyToken, statusToDammage);

router.put("/edit", verifyToken, updateDevice);

// delete

router.delete("/delete/:id", verifyToken, deleteDevice);

export default router;
