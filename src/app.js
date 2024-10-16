import "dotenv/config";
import "express-async-errors";
import express from "express";
import { v2 as cloudinary } from "cloudinary";

import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";

import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import authorizeRoles from "./middlewares/admin.middleware.js";
import authenticateUser from "./middlewares/auth.middleware.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import notFound from "./middlewares/not-found.middleware.js";

import connectDB from "./config/db.config.js";

import auth from "./controllers/auth/auth.route.js";
import mangas from "./controllers/mangas/route.manga.js";
import adminRoutes from "./controllers/admin/route.admin.js";

const swaggerDocument = YAML.load("./swagger.yaml");
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

app.use(express.json());
app.use(express.static("public"));

app.use(helmet());
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 30 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(mongoSanitize());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

connectDB();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes
app.use(
  "/api/v1/admin",
  authenticateUser,
  authorizeRoles("admin"),
  adminRoutes
);
app.use("/api/v1/auth", auth);
app.use("/api/v1/mangas", authenticateUser, mangas);

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

export default app;
