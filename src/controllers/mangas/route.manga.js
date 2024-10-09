import express from "express";

import * as mangasController from "./controller.manga.js";
import validate from "../../middlewares/validation.middleware.js";
import { MangaParamsSchema } from "../../schemas/manga.schema.js";

const router = express.Router();

router.route("/").get(mangasController.getAll);

router
  .route("/:id")
  .get(validate({ paramsSchema: MangaParamsSchema }), mangasController.get);

export default router;
