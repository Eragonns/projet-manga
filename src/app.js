import "express-async-errors";
import express from "express";
import "dotenv/config";

import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import connectDB from "./config/db.config.js";
import { auth } from "./features/auth/index.js";

const app = express();

connectDB();

app.use(express.json());

app.use("/api/v1/auth", auth);
// app.use("/api/v1/dashboard");

app.use(notFound);
app.use(errorHandler);

export default app;
