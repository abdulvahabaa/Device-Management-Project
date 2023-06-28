import jwt from "jsonwebtoken";

import JWT_Token from "../models/Token.js";

export const verifyToken = async (req, res, next) => {
  // console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization;
    console.log(token)

    if (!token) {
      return res.status(403).send("Access Token Denied");
    }

    if (token.startsWith("Bearer ")) {
      const extractedToken = token.slice(7).trimLeft();
      const verified = jwt.verify(extractedToken, process.env.JWT_SECRET);

      console.log("Token verified");

      req.engineer = verified;
      next();
    } else {
      return res.status(403).send("Access Token Denied");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// export const verifyToken = async (req, res, next) => {
//   // console.log(req.headers.authorization);
//   try {
//       const token = req.headers.authorization;
//       console.log(token)


//       if (!token) {
//           return res.status(403).send("Access Denied");
//       }

//       if (token.startsWith("Bearer ")) {
//           const extractedToken = token.slice(7).trimLeft();

//           // Decode the token
//           const decoded = jwt.decode(extractedToken);

//           // Access the ID from the decoded payload
//           const engineerId = decoded.id;


//           const revokedToken = await JWT_Token.findOne({engineerId: engineerId, revokedTokens: { $in: [extractedToken] } })
//           console.log(revokedToken)
//           if (revokedToken) {
//               return res.status(401).json({ msg: "Token is revoked." });
//           }

//           const verified = jwt.verify(extractedToken, process.env.JWT_SECRET);
//           console.log("Token verified");

//           req.engineer = verified;
//           next();
//       } else {
//           return res.status(403).send("Access Denied");
//       }
//   } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
// };