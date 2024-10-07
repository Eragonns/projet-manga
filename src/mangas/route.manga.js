import express from "express";

import validate from "../middlewares/validation.middleware.js";
import { MangaBodySchema, MangaParamsSchema } from "./schema.manga.js";
import * as mangasControlller from "./controller.manga.js";

const router = express.Router();

router
  .route("/")
  .get(mangasControlller.getUsersMangas)
  .post(validate({ bodySchema: MangaBodySchema }), mangasControlller.create);

router
  .route("/:id")
  .get(validate({ paramsSchema: MangaParamsSchema }), mangasControlller.get)
  .put(
    validate({ paramsSchema: MangaParamsSchema, bodySchema: MangaBodySchema }),
    mangasControlller.update
  )
  .delete(
    validate({ paramsSchema: MangaParamsSchema }),
    mangasControlller.remove
  );

export default router;
