import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { 
  createCategoryController, 
  categoryController, 
  updateCategoryController, 
  singleCategoryController, 
  deleteCategoryController 
} from "../controllers/categoryController.js";

const router = express.Router();

// Create category (Admin only)
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// Update category (Admin only)
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

// Get all categories
router.get("/get-category", categoryController);

// Get single category
router.get("/single-category/:slug", singleCategoryController);

// Delete category (Admin only)
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);


export default router;

