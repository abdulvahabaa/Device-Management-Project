import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Engineer from "../models/Engineers.js";

import JWT_Token from "../models/Token.js";

// create Engineer
export const signup = async (req, res) => {
    console.log("here>>>>> Reached")
    console.log(req.body)
  try {
    console.log(req.body)
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt()
    const passwordhash = await bcrypt.hash(password,salt)

    const newEngineer = new Engineer({
        name,
        email,
        password:passwordhash

    })

    const savedEngineer = await newEngineer.save();
    res.status(201).json(savedEngineer);

  } catch (err) {
    res.status(500).json({ error: err.error})
  }
};


// login function 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const engineer = await Engineer.findOne({ email: email });
    if (!engineer) return res.status(400).json({ msg: "Engineer does not exist." });

    const isMatch = await bcrypt.compare(password, engineer.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Engineer Credentials..." });

    const token = jwt.sign({ id: engineer._id }, process.env.JWT_SECRET);
    delete engineer.password;

    res.status(200).json({ token, engineer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const engineer = await Engineer.findOne({ email: email });
//     if (!engineer) return res.status(400).json({ msg: "Engineer does not exist." });

//     const isMatch = await bcrypt.compare(password, engineer.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid Engineer Credentials..." });

//     // Check if the token is revoked
//     const revokedToken = await JWT_Token.findOne({ token: { $in: engineer.revokedTokens } });
//     if (revokedToken) {
//       // Token is revoked, user cannot login
//       return res.status(401).json({ msg: "Token revoked. Please login again." });
//     }

//     const accessToken = jwt.sign({ id: engineer._id }, process.env.JWT_SECRET, {
//       expiresIn: "5h",
//     });
//     // delete engineer.password;
//     // Save the token in the database
//     const tokenInstance = new JWT_Token({ token: accessToken });
//     await tokenInstance.save();

//     res.status(200).json({ token: accessToken, engineer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



export const logout = async (req, res) => {
  console.log("called logout")
  try {
    const token = req.headers.authorization;
    // console.log(token)

    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }

    if (token.startsWith("Bearer ")) {
      const extractedToken = token.slice(7).trimLeft();

      const decodedToken = jwt.decode(extractedToken);

      const tokenId = decodedToken.jti;

      // Assuming the token schema model is in the correct file path

      // Find the token in the token collection
      const revokedToken = await JWT_Token.findOne({ _id: tokenId });
      // console.log(revokedToken)

      if (revokedToken) {
        // Token already revoked
        return res.status(400).json({ error: "Token already revoked" });
      }

      // Add the token to the revokedTokens array
      const test =await Token.updateOne({ _id: tokenId }, { $push: { revokedTokens: extractedToken } });
      console.log(test)

      res.status(200).json({ message: "Logout successful" });
    } else {
      return res.status(400).json({ error: "Invalid token format" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

