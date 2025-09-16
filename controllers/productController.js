import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";


// =======================
// CREATE PRODUCT
// =======================
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo must be less than 1MB" });
    }

    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
      shipping: shipping === "1" ? true : false,
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.mimetype;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

// =======================
// GET ALL PRODUCTS
// =======================
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      countTotal: products.length,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// =======================
// GET SINGLE PRODUCT
// =======================
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    res.status(200).send({ success: true, product });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting product details",
      error: error.message,
    });
  }
};

// =======================
// PRODUCT PHOTO
// =======================
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
    res.status(404).send({ success: false, message: "No photo found" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error: error.message,
    });
  }
};

// =======================
// DELETE PRODUCT
// =======================
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};

// =======================
// UPDATE PRODUCT
// =======================
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
        shipping: shipping === "1" ? true : false,
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.mimetype;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating product",
      error: error.message,
    });
  }
};

// =======================
// PRODUCT FILTERS
// =======================
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    if (checked?.length > 0) args.category = { $in: checked };
    if (radio?.length === 2) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args).select("-photo");
    res.status(200).send({
      success: true,
      products,
      countTotal: products.length,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error filtering products",
      error: error.message,
    });
  }
};

// =======================
// PRODUCT COUNT
// =======================
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error counting products",
      error: error.message,
    });
  }
};

// =======================
// PRODUCT LIST (PAGINATION)
// =======================
export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching product list",
      error: error.message,
    });
  }
};

// =======================
// SEARCH PRODUCT
// =======================
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }

    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo.data");

    // Use full backend URL
    const API = process.env.BACKEND_URL || "http://localhost:5000";

    const resultsWithPhoto = results.map((p) => ({
      ...p.toObject(),
      photoUrl: `${API}/api/v1/product/product-photo/${p._id}`,
    }));

    res.status(200).json({ success: true, results: resultsWithPhoto });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed", error: error.message });
  }
};

// =======================
// RELATED PRODUCTS
// =======================
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({ success: true, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching related products",
      error: error.message,
    });
  }
};

// =======================
// PRODUCTS BY CATEGORY
// =======================
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }

    const products = await productModel
      .find({ category: category._id })
      .populate("category")
      .select("-photo");

    res.status(200).send({ success: true, category, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

// =======================
// ALL CATEGORIES
// =======================
export const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({}).sort({ name: 1 });
    res.status(200).send({
      success: true,
      message: "All categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting categories",
      error: error.message,
    });
  }
};


export const createOrderController = async (req, res) => {
  try {
    const { cart, payment } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!payment || !payment.id) {
      return res.status(400).json({ success: false, message: "Invalid payment data" });
    }

    const orderProducts = cart.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const order = new Order({
      products: orderProducts,
      payment,
      buyer: req.user._id,
      status: "Processing",
    });

    await order.save();

    res.status(201).json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
