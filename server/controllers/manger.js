import jwt from "jsonwebtoken";
import Devices from "../models/Devices.js";
import Engineers from "../models/Engineers.js";
import Token from "../models/Token.js";
import dotenv from "dotenv";
import Device from "../models/Devices.js";
dotenv.config();

export const adminLogin = async (req, res) => {
  try {
    console.log("?????????????????????????");
    console.log(req.body);
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ id: email }, process.env.JWT_SECRET);
      res.status(200).json({ token, admin: true });
    } else {
      res.status(400).json({ message: "incorrect email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDammageinfo = async (req, res) => {
  console.lgo("called dammage info>>>>")

  try {
    const device = await Device.find({ status: "dammage" });
    res.status(200).json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
