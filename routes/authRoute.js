import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  createOrderController,
  getOrdersController,
  updateOrderController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Register user
router.post("/register", registerController);

// Login user
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Test route for admins only
router.get("/test", requireSignIn, isAdmin, testController);

// Protected user route: any authenticated user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected admin route: only authenticated admin users
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

// Create new order
router.post("/orders", requireSignIn, createOrderController);

// Get orders for logged-in user
router.get("/all-orders", requireSignIn, isAdmin, getOrdersController);



// Update order status (Admin only)
router.put("/order-status/:orderId", requireSignIn, isAdmin, updateOrderController);




export default router;
