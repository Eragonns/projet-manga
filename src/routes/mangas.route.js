import express from "express";

import * as mangasController from "../controllers/manga.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/mangas")
  .post(upload.array("manga", 20), mangasController.create)
  .get(mangasController.getAll);

export default router;
