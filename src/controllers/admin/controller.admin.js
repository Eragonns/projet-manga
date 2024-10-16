import { formatImage } from "../../middlewares/multer.middleware.js";
import * as mangasService from "../../services/mangas.service.js";
import { checkPermissions } from "../../utils/checkPermissions.util.js";
import { NotFoundError } from "../../errors/index.js";

import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
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

    const slugTitle = slugify(title, { lower: true, strict: true });
    const timestamp = Date.now();
    const folderName = `mangas/${slugTitle}_${timestamp}`;

    for (const file of files) {
      if (file.size > maxSize) {
        throw new Error("Veuillez fournir une image de taille inferieur a 1Mo");
      }
      const formattedImage = formatImage(file);
      const response = await cloudinary.uploader.upload(formattedImage, {
        folder: folderName
      });
      images.push(response.secure_url);
    }

    const firstChapter = {
      title: "Chapitre 1",
      images,
      folderName: `${folderName}/chapitre_1`
    };

    const newManga = await mangasService.create({
      title,
      author,
      genre,
      status,
      chapters: [firstChapter],
      createdBy: req.user.userId
    });
    res.status(StatusCodes.CREATED).json({ manga: newManga });
  } catch (error) {
    console.error("Erreur lors de la création du manga :", error);
    next(error);
  }
};

const addChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const files = req.files || [];

    if (files.length === 0)
      throw new Error("Aucun fichier fourni pour le chapitre");

    const maxSize = 1024 * 1024;
    const images = [];

    const manga = await mangasService.get(id);
    if (!manga) throw new NotFoundError(`Aucun manga trouvé avec l'ID ${id}`);

    const slugTitle = slugify(title, { lower: true, strict: true });
    const chapterNumber = manga.chapters.length + 1;
    const folderName = `mangas/${slugify(manga.title, {
      lower: true,
      strict: true
    })}_${manga.createdAt.getTime()}/chapitre_${chapterNumber}`;

    for (const file of files) {
      if (file.size > maxSize)
        throw new Error(
          "Veuillez fournir une image de taille inferieur a 1 MO"
        );

      const formattedImage = formatImage(file);
      const response = await cloudinary.uploader.upload(formattedImage, {
        folder: folderName
      });
      images.push(response.secure_url);
    }

    const newChapter = {
      title,
      images,
      folderName
    };

    const updatedManga = await mangasService.addChapter(id, newChapter);
    res.status(StatusCodes.OK).json({ manga: updatedManga });
  } catch (error) {
    console.error("Erreur lors de l'ajout du chapitre :", error);
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
    const { id } = req.params;
    const manga = await mangasService.get(id);
    checkPermissions(req.user, manga.createdBy);
    const updatedManga = await mangasService.update(id, req.body);
    res.status(StatusCodes.OK).json({ manga: updatedManga });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Tentative de suppression du manga avec l'ID : ${id}`);
    const manga = await mangasService.get(id);
    checkPermissions(req.user, manga.createdBy);

    if (!manga) {
      throw new NotFoundError(`Aucun manga contenant cet id ${id}`);
    }
    if (manga.chapters && manga.chapters.length > 0) {
      for (const chapter of manga.chapters) {
        if (chapter.folderName) {
          console.log(
            `Suppression des images dans le dossier : ${chapter.folderName}`
          );
          await cloudinary.api.delete_resources_by_prefix(chapter.folderName);
          await cloudinary.api.delete_folder(chapter.folderName);
        }
      }
    }

    const removedManga = await mangasService.remove(id);
    console.log(`Manga supprimé : ${removedManga.title}`);
    res.status(StatusCodes.OK).json({ manga: removedManga });
  } catch (error) {
    next(error);
  }
};

const removeChapter = async (req, res, next) => {
  try {
    const { mangaId, chapterId } = req.params;

    const manga = await mangasService.get(mangaId);
    checkPermissions(req.user, manga.createdBy);

    if (!manga)
      throw new NotFoundError(`Aucun manga trouvé avec l'ID ${mangaId}`);

    const chapter = manga.chapters.id(chapterId);
    if (!chapter)
      throw new NotFoundError(`Aucun chapitre trouvé avec l'ID ${chapterId}`);

    if (chapter.folderName) {
      console.log(
        `Suppression des images dans le dossier  : ${chapter.folderName}`
      );
      await cloudinary.api.delete_resources_by_prefix(chapter.folderName);
      await cloudinary.api.delete_folder(chapter.folderName);
    }

    await mangasService.removeChapter(mangaId, chapterId);
    res.status(StatusCodes.OK).json({ msg: "Chapitre supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du chapitre :", error);
    next(error);
  }
};

export { createManga, addChapter, getAllMangas, update, remove, removeChapter };
