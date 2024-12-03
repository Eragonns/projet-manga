import { StatusCodes } from "http-status-codes";
import * as mangasService from "../../services/mangas.service.js";

const getUsersMangas = async (req, res) => {
  const mangas = await mangasService.getUsersMangas(req.user.userId);
  res.status(StatusCodes.OK).json({ nbHits: mangas.length, mangas });
};

const get = async (req, res) => {
  const manga = await mangasService.get(req.params.id);
  res.status(StatusCodes.OK).json({ manga });
};

const getAll = async (_req, res) => {
  const mangas = await mangasService.getAll();
  res.status(StatusCodes.OK).json({ mangas });
};

const getChapter = async (req, res) => {
  const { mangaId, chapterId } = req.params;
  try {
    const chapter = await mangasService.getChapterById(mangaId, chapterId);
    if (!chapter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Chapitre non trouvé" });
    }
    res.status(StatusCodes.OK).json({ chapter });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Erreur serveur" });
  }
};

export { getUsersMangas, get, getAll, getChapter };
