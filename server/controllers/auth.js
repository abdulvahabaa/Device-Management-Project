import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Engineer from "../models/Engineers.js";

import JWT_Token from "../models/Token.js";

// create Engineer
export const signup = async (req, res) => {
  console.log("here>>>>> Reached");
  console.log(req.body);
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordhash = await bcrypt.hash(password, salt);

    const newEngineer = new Engineer({
      name,
      email,
      password: passwordhash,
    });

    const savedEngineer = await newEngineer.save();
    res.status(201).json(savedEngineer);
  } catch (err) {
    res.status(500).json({ error: err.error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let engineer = await Engineer.findOne({ email: email });

    if (!engineer)
      return res.status(400).json({ msg: "Engineer does not exist." });

    const isMatch = await bcrypt.compare(password, engineer.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid Engineer Credentials..." });

    const token = jwt.sign({ id: engineer._id }, process.env.JWT_SECRET, {
      expiresIn: "10h", // Set the expiry time for 1 hour (can be adjusted as needed)
    });

    // Remove password field from the engineer object
    engineer = await Engineer.findOne({ email: email }).select("-password");

    res.status(200).json({ token, engineer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  console.log("<<<<<<<>Logout<<<<<>>>>>>");
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    // Decode the token
    const decoded = jwt.decode(token);

    // Access the ID from the decoded payload
    const engineerId = decoded.id;
    console.log(engineerId);

    // Find the document with the engineerId
    let revokedTokenDoc = await JWT_Token.findOne({ engineerId: engineerId });

    if (!revokedTokenDoc) {
      // If document doesn't exist, create a new one
      revokedTokenDoc = await JWT_Token.create({
        engineerId: engineerId,
        revokedTokens: [token],
      });
    } else {
      // Update the existing document by pushing the token to the revokedTokens array
      revokedTokenDoc.revokedTokens.push(token);
      await revokedTokenDoc.save();
    }

    // console.log(revokedTokenDoc);

    res.status(200).json({ msg: "Logged out successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
