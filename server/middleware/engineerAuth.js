import jwt from "jsonwebtoken";
import JWT_Token from "../models/Token.js";

export const verifyToken = async (req, res, next) => {
  // console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      const extractedToken = token.slice(7).trimLeft();
      const verified = jwt.verify(extractedToken, process.env.JWT_SECRET);

      console.log("Token verified");
      
      req.engineer = verified;
      next();
    } else {
      return res.status(403).send("Access Denied");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// export const verifyToken = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res.status(403).send("Access Denied");
//     }

//     if (token.startsWith("Bearer ")) {
//       const extractedToken = token.slice(7).trimLeft();

//       // Check if the token exists in the token database
//       const tokenExists = await JWT_Token.exists({ token: extractedToken });
//       if (!tokenExists) {
//         return res.status(403).send("Access Denied");
//       }

//       const verified = jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//           // Token verification failed, likely expired
//           console.log("Token verification failed:", err.message);
//           return res.status(403).send("Access Denied");
//         }
//         return decoded;
//       });

//       console.log("Token verified");

//       req.engineer = verified;
//       next();
//     } else {
//       return res.status(403).send("Access Denied");
//     }
//   } catch (err) {
//     console.log("Token verification error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

