import { StatusCodes } from "http-status-codes";
import * as mangasService from "../../services/mangas.service.js";
import { checkPermissions } from "../../utils/checkPermissions.util.js";

const getUsersMangas = async (req, res) => {
  const mangas = await mangasService.getUsersMangas(req.user.userId);
  res.status(StatusCodes.OK).json({ nbHits: mangas.length, mangas });
};

const get = async (req, res) => {
  const manga = await mangasService.get(req.params.id);
  checkPermissions(req.user, manga.createdBy);
  res.status(StatusCodes.OK).json({ manga });
};

const getAll = async (_req, res) => {
  const mangas = await mangasService.getAll();
  res.status(StatusCodes.OK).json({ mangas });
};

export { getUsersMangas, get, getAll };
