import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutrs from "./routes/productRoutrs.js";
import path from "path";

// Configure env
dotenv.config();

// Connect to database
connectDB();

// Create express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// ✅ Add Content Security Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline' *.braintreegateway.com *.braintree-api.com https://static.cloudflareinsights.com"
  );
  next();
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutrs);

// Serve React frontend
const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname1, "client", "build", "index.html"));
});

// Root route (optional, React will handle this)
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

// PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE || "development"} mode on port ${PORT}`.bgCyan.white
  );
});
