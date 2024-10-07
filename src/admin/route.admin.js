import express from "express";
import * as adminController from "./controller.admin.js";
import validate from "../middlewares/validation.middleware.js";
import { MangaBodySchema } from "../mangas/schema.manga.js";

const router = express.Router();

router.post(
  "/mangas",
  validate({ bodySchema: MangaBodySchema }),
  adminController.createManga
);

router.get("/mangas", adminController.getAllMangas);

export default router;
