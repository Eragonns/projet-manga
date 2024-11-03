import express from "express";
import * as genresController from "./genres.controller.js";

const router = express.Router();

router.get("/popular", genresController.getMostReadGenres);

export default router;
