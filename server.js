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
import { fileURLToPath } from "url";

// Configure env
dotenv.config();

// Connect to database
connectDB();

// Create express app
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",                // Dev
      process.env.CLIENT_URL,                  // Production (Render frontend)
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Content Security Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline' *.braintreegateway.com *.braintree-api.com https://static.cloudflareinsights.com"
  );
  next();
});

// API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutrs);

// Serve React build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "client", "build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `✅ Server Running on ${process.env.DEV_MODE || "development"} mode on port ${PORT}`.bgCyan.white
  );
});
