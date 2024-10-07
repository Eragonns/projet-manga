import "express-async-errors";
import express from "express";
import "dotenv/config";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

import adminRoutes from "./admin/route.admin.js";
import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import authenticateUser from "./middlewares/auth.middleware.js";
import connectDB from "./config/db.config.js";
import { auth } from "./features/auth/index.js";
import { mangas } from "./mangas/index.js";
import authorizeRoles from "./middlewares/admin.middleware.js";

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
    windowMs: 15 * 30 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);
app.use(mongoSanitize());
app.use(cors());

connectDB();

app.use(
  "/api/v1/admin",
  authenticateUser,
  authorizeRoles("admin"),
  adminRoutes
);
app.use("/api/v1/auth", auth);
app.use("/api/v1/mangas", authenticateUser, mangas);

app.use(notFound);
app.use(errorHandler);

export default app;
