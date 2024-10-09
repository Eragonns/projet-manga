import express from "express";

import * as adminController from "./controller.admin.js";
import validate from "../../middlewares/validation.middleware.js";
import { MangaBodySchema } from "../../schemas/manga.schema.js";
import upload from "../../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/mangas",
  upload.array("manga", 20),
  validate({ bodySchema: MangaBodySchema }),
  adminController.createManga
);

router.get("/mangas", adminController.getAllMangas);

export default router;
