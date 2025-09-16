import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js"; 
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validations with status codes
    if (!name) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }
    if (!email) {
      return res.status(400).send({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ success: false, message: "Password is required" });
    }
    if (!phone) {
      return res.status(400).send({ success: false, message: "Phone number is required" });
    }
    if (!address) {
      return res.status(400).send({ success: false, message: "Address is required" });
    }
    if (!answer) {
      return res.status(400).send({ success: false, message: "Answer is required" });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare password - fix typo here!
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) {
      return res.status(400).send({ success: false, message: "Email is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ success: false, message: "New Password is required" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Hash new password and update
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something went wrong", error });
  }
};


// Test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;

    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (password && password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address; // single object/string
    if (hashedPassword) user.password = hashedPassword;

    const updatedUser = await user.save();
    const out = updatedUser.toObject();
    delete out.password; // don’t send password back

    res.status(200).json({ success: true, message: "Profile updated successfully", updatedUser: out });
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};


// ======================
// CREATE ORDER (User)
// ======================
export const createOrderController = async (req, res) => {
  try {
    const { cart, payment, address } = req.body;

    const order = await new orderModel({
      products: cart,
      payment,
      buyer: req.user._id,
      address,
    }).save();

    res.status(201).send({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while creating order",
      error,
    });
  }
};

// ======================
// GET ALL ORDERS (Admin)
// ======================
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo") // populate product details except photo
      .populate("buyer", "name email"); // show buyer info

    res.json({
      success: true,
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching orders",
      error,
    });
  }
};

// ======================
// UPDATE ORDER STATUS (Admin)
// ======================
export const updateOrderController = async (req, res) => {
  try {
    const { orderId } = req.params; // get orderId from URL
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating order status",
      error,
    });
  }
};
