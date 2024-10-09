import { formatImage } from "../../middlewares/multer.middleware.js";
import * as mangasService from "../../services/mangas.service.js";

import { v2 as cloudinary } from "cloudinary";
import { checkPermissions } from "../../utils/checkPermissions.util.js";
import { StatusCodes } from "http-status-codes";

const createManga = async (req, res, next) => {
  try {
    console.log("Requete de creation de manga :", req.body, req.files);
    const { title, author, genre, status } = req.body;

    const files = req.files || [];
    if (files.length === 0) {
      throw new Error("Aucun fichier fourni");
    }

    const maxSize = 1024 * 1024;
    const images = [];
    for (const file of files) {
      if (file.size > maxSize) {
        throw new Error("Veuillez fournir une image de taille inferieur a 1Mo");
      }
      const formattedImage = formatImage(file);
      const response = await cloudinary.uploader.upload(formattedImage, {
        folder: "mangas"
      });
      images.push(response.secure_url);
    }

    const newManga = await mangasService.create({
      title,
      author,
      genre,
      status,
      images,
      createdBy: req.user.userId
    });
    res.status(StatusCodes.CREATED).json({ manga: newManga });
  } catch (error) {
    next(error);
  }
};

const getAllMangas = async (_req, res, next) => {
  try {
    const mangas = await mangasService.getAll();
    res.status(StatusCodes.OK).json({ mangas });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const manga = await mangasService.get(req.params.id);
    checkPermissions(req.user, manga.createdBy);
    const updatedManga = await mangasService.update(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ manga: updatedManga });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const manga = await mangasService.get(req.params.id);
    checkPermissions(req.user, manga.createdBy);
    const removedManga = await mangasService.remove(req.params.id);
    res.status(StatusCodes.OK).json({ manga: removedManga });
  } catch (error) {
    next(error);
  }
};

export { createManga, getAllMangas, update, remove };
