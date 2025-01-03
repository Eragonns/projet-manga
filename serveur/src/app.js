import "dotenv/config";
import "express-async-errors";
import express from "express";
import { v2 as cloudinary } from "cloudinary";

import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { corsOptionsDelegate } from "./utils/cors.util.js";

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
import user from "./controllers/user/route.user.js";
import manga from "./controllers/manga/route.manga.js";

const swaggerDocument = YAML.load("./swagger.yaml");
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  timeout: 300000
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: corsOptionsDelegate,
    credentials: true
  })
);
app.use(helmet());
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limite chaque IP à 100 requêtes par fenêtre
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(mongoSanitize());

connectDB();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/", (_req, res) => {
  res
    .status(StatusCodes.OK)
    .send("<h1>ScanMangaVerse</h1><a href='/api-docs'>Documentation</a>");
});

// Routes
app.use(
  "/api/v1/admin",
  authenticateUser,
  authorizeRoles("admin"),
  adminRoutes
);

app.use("/api/v1/users", user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/mangas", authenticateUser, mangas);
app.use("/api/v1/manga", manga);

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

export default app;
