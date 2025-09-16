import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // ✅ Reference to Product model
          required: true,
        },
        name: { type: String, required: true }, // snapshot of product name
        price: { type: Number, required: true }, // snapshot of price at purchase
        quantity: { type: Number, default: 1 },
      },
    ],
    payment: {
      id: { type: String, required: true }, // transaction/order id
      method: { type: String, required: true }, // e.g., PayPal, Card, UPI
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
      status: { type: String, default: "Pending" }, // Pending, Paid, Failed, Refunded
      rawResponse: { type: Object }, // store entire gateway response (optional)
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ must match your user model name
      required: true,
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    deliveredAt: { type: Date }, // optional: track delivery date
    cancelledAt: { type: Date }, // optional: track cancellation date
  },
  { timestamps: true }
);

// ✅ Index for faster queries by buyer
orderSchema.index({ buyer: 1 });

export default mongoose.model("Order", orderSchema);
