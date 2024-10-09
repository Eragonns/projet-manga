import express from "express";
import authRoutes from "../controllers/auth/auth.route.js";
import adminRoutes from "../controllers/admin/route.admin.js";
import mangasRoutes from "../controllers/mangas/route.manga.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/mangas", mangasRoutes);

export default router;
