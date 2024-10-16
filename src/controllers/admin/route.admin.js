import express from "express";

import * as adminController from "./controller.admin.js";
import validate from "../../middlewares/validation.middleware.js";
import {
  MangaBodySchema,
  ChapterBodySchema
} from "../../schemas/manga.schema.js";
import upload from "../../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/mangas",
  upload.array("manga", 20),
  validate({ bodySchema: MangaBodySchema }),
  adminController.createManga
);

router.post(
  "/mangas/:id/chapters",
  upload.array("images", 20),
  validate({ bodySchema: ChapterBodySchema }),
  adminController.addChapter
);

router.get("/mangas", adminController.getAllMangas);

router.delete("/mangas/:id", adminController.remove);
router.delete(
  "/mangas/:mangaId/chapters/:chapterId",
  adminController.removeChapter
);

export default router;
