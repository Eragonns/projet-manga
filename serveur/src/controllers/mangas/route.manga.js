import express from "express";

import * as mangasController from "./controller.manga.js";
import validate from "../../middlewares/validation.middleware.js";
import {
  MangaParamsSchema,
  ChapterParamsSchema
} from "../../schemas/manga.schema.js";

const router = express.Router();

router.route("/").get(mangasController.getAll);

router
  .route("/:id")
  .get(validate({ paramsSchema: MangaParamsSchema }), mangasController.get);

router
  .route("/:mangaId/chapters/:chapterId")
  .get(
    validate({ paramsSchema: ChapterParamsSchema }),
    mangasController.getChapter
  );

export default router;
