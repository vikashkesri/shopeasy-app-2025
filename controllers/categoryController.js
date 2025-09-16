import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// ✅ Create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "New category created successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Error in createCategoryController:", error);
    res.status(500).send({
      success: false,
      message: "Error while creating category",
      error,
    });
  }
};

// ✅ Update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Error in updateCategoryController:", error);
    res.status(500).send({
      success: false,
      message: "Error while updating category",
      error,
    });
  }
};

// ✅ Get all categories
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({}).sort({ name: 1 }); // sorted A-Z
    res.status(200).send({
      success: true,
      message: "All categories list",
      category,
    });
  } catch (error) {
    console.error("❌ Error in categoryController:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting categories",
      error,
    });
  }
};

// ✅ Get single category by slug
export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await categoryModel.findOne({ slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single category fetched successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Error in singleCategoryController:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting single category",
      error,
    });
  }
};

// ✅ Delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteCategoryController:", error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
