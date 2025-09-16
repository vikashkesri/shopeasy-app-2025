import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  createOrderController,
} from "../controllers/productController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// BRAINTREE
// router.get("/braintree/token", braintreeTokenController);
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

// PRODUCT ROUTES
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController);
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);
router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProductController);
router.get("/product-photo/:pid", productPhotoController);
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);
router.post("/product-filters", productFiltersController);
router.get("/product-count", productCountController);
router.get("/product-list/:page", productListController);
router.get("/search", searchProductController);
router.get("/product-category/:slug", productCategoryController);
router.get("/related-product/:pid/:cid", relatedProductController);

// Create Order after payment
router.post("/create-order", requireSignIn, createOrderController);

export default router;
