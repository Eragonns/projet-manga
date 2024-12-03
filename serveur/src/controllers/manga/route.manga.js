import express from "express";
import * as mangaController from "./manga.controller.js";

const router = express.Router();

router.get("/popular", mangaController.getMostReadManga);
router.post("/:id/increment-reads", mangaController.incrementReads);

export default router;
