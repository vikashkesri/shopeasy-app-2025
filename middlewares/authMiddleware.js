//new update from chatgt

import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Token verification middleware
// export const requireSignIn = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader?.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "Token missing" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = JWT.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // now _id exists
//     next();
//   } catch (error) {
//     console.error("JWT error:", error);
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


// Role-based admin access check
// export const isAdmin = async (req, res, next) => {
//   try {
//     const user = await userModel.findById(req.user._id);
//     if (user.role !== 1) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized access - Admin only",
//       });
//     }
//     next();
//   } catch (error) {
//     console.error("Admin check failed:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error in admin middleware",
//       error,
//     });
//   }
// };

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.role !== 1) {
      return res.status(403).json({ success: false, message: "Unauthorized access - Admin only" });
    }
    next();
  } catch (error) {
    console.error("Admin check failed:", error.message);
    res.status(500).json({ success: false, message: "Error in admin middleware" });
  }
};
