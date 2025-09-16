import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true, // optional: ensures no duplicate slugs
      index: true,  // optional: improves performance for slug-based queries
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
