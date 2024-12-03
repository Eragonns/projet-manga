import { StatusCodes } from "http-status-codes";
import * as mangasService from "../../services/mangas.service.js";

export const getMostReadManga = async (_req, res) => {
  const mangas = await mangasService.getMostReadManga();
  res.status(StatusCodes.OK).json({ mangas });
};

export const incrementReads = async (req, res) => {
  const { id } = req.params;
  const manga = await mangasService.incrementReads(id);
  res.status(StatusCodes.OK).json({ manga });
};
