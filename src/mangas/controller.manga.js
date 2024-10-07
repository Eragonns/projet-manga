import { StatusCodes } from "http-status-codes";
import * as mangaService from "./service.manga.js";
import { checkPermissions } from "../utils/checkPermissions.util.js";

const create = async (req, res) => {
  const createdManga = await mangaService.create(req.body, req.user.userId);
  res.status(StatusCodes.CREATED).json({ manga: createdManga });
};

const getUsersMangas = async (req, res) => {
  const mangas = await mangaService.getUsersMangas(req.user.userId);
  res.status(StatusCodes.OK).json({ nbHits: mangas.length, mangas });
};

const get = async (req, res) => {
  const manga = await mangaService.get(req.params.id);
  checkPermissions(req.user, manga.createdBy);
  res.status(StatusCodes.OK).json({ manga });
};

const update = async (req, res) => {
  const manga = await mangaService.get(req.params.id);
  checkPermissions(req.user, manga.createdBy);
  const updatedManga = await mangaService.update(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ manga: updatedManga });
};

const remove = async (req, res) => {
  const manga = await mangaService.get(req.params.id);
  checkPermissions(req.user, manga.createdBy);
  const removedManga = await mangaService.remove(req.params.id);
  res.status(StatusCodes.OK).json({ manga: removedManga });
};

export { create, getUsersMangas, get, update, remove };
