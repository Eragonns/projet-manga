import { formatImage } from "../../middlewares/multer.middleware.js";
import * as mangasService from "../../services/mangas.service.js";
import { checkPermissions } from "../../utils/checkPermissions.util.js";
import { NotFoundError } from "../../errors/index.js";

import {
  ChapterBodySchema,
  ChapterTextBodySchema
} from "../../schemas/manga.schema.js";

import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";

const createManga = async (req, res, next) => {
  try {
    console.log("Données reçues :", req.body);
    console.log("Fichiers reçus :", req.files);
    const { title, author, genre, description, status, chapterTitle } =
      req.body;

    if (!title)
      throw new Error(
        "Le titre est requis et doit être une chaîne de caractères."
      );

    if (!chapterTitle)
      throw new Error(
        "Le titre du chapitre est requis et doit être une chaîne de caractères."
      );

    if (
      !req.files ||
      !req.files.coverImage ||
      req.files.coverImage.length === 0
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "L'image de couverture est requise" });
    }

    const coverFile = req.files.coverImage[0];
    const mangaFiles = req.files.mangas || [];

    const maxSize = 1024 * 1024;

    if (coverFile.size > maxSize)
      throw new Error("L'image de couverture doit être inférieure à 1Mo");

    const formattedImage = formatImage(coverFile);
    const coverResponse = await cloudinary.uploader.upload(formattedImage, {
      folder: "covers"
    });
    const coverImageUrl = coverResponse.secure_url;

    const slugTitle = slugify(title, { lower: true, strict: true });
    const timestamp = Date.now();
    const folderName = `mangas/${slugTitle}_${timestamp}`;

    const images = [];
    for (const file of mangaFiles) {
      if (file.size > maxSize)
        throw new Error("Veuillez fournir une image de taille inferieur a 1Mo");

      const formattedImage = formatImage(file);
      const response = await cloudinary.uploader.upload(formattedImage, {
        folder: `${folderName}/chapitre_1_${slugify(chapterTitle, {
          lower: true,
          strict: true
        })}`
      });
      images.push(response.secure_url);
    }

    const firstChapter = {
      title: chapterTitle || "Chapitre 1",
      images,
      folderName: `${folderName}/chapitre_1_${slugify(chapterTitle, {
        lower: true,
        strict: true
      })}`
    };

    const newManga = await mangasService.create({
      title,
      author,
      genre,
      description,
      status,
      coverImage: coverImageUrl,
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
    console.log("Fichiers reçus :", req.files);

    const { id } = req.params;
    const { title } = req.body;

    const parsedTextData = ChapterTextBodySchema.safeParse({ title });
    if (!parsedTextData.success)
      return res.status(StatusCodes.BAD_REQUEST).json(parsedTextData.error);

    const files = req.files.chapterImages || [];
    const maxSize = 1024 * 1024;

    if (files.length === 0)
      throw new Error("Aucun fichier fourni pour le chapitre");

    const manga = await mangasService.get(id);
    if (!manga) throw new NotFoundError(`Aucun manga trouvé avec l'ID ${id}`);

    const slugTitle = slugify(manga.title, { lower: true, strict: true });
    const folderName = manga.chapters[0].folderName.split("/chapitre_")[0];

    const chapterNumber = manga.chapters.length + 1;
    const chapterFolder = `${folderName}/chapitre_${chapterNumber}_${slugify(
      title,
      {
        lower: true,
        strict: true
      }
    )}`;

    const images = [];
    for (const file of files) {
      if (file.size > maxSize)
        throw new Error(
          "Veuillez fournir une image de taille inférieure à 1 Mo"
        );

      const formattedImage = formatImage(file);
      const response = await cloudinary.uploader.upload(formattedImage, {
        folder: chapterFolder
      });
      images.push(response.secure_url);
    }

    const parsedCompleteData = ChapterBodySchema.safeParse({
      title,
      images,
      folderName: chapterFolder
    });

    if (!parsedCompleteData.success) {
      return res.status(StatusCodes.BAD_REQUEST).json(parsedCompleteData.error);
    }

    const updatedManga = await mangasService.addChapter(
      id,
      parsedCompleteData.data
    );

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
    if (!manga)
      throw new NotFoundError(`Auncun manga trouvé avec cet ID: ${id}`);

    checkPermissions(req.user, manga.createdBy);

    const { title, author, genre, description, status } = req.body;

    const updatedData = {
      title: title || manga.title,
      author: author || manga.author,
      genre: genre || manga.genre,
      description: description || manga.description,
      status: status || manga.status
    };

    if (req.files && req.files.coverImage) {
      const newCoverFile = req.files.coverImage[0];

      const coverImageId = getIdFromUrl(manga.coverImage, "covers");
      await cloudinary.uploader.destroy(coverImageId);

      const formattedCoverImage = formatImage(newCoverFile);
      const coverResponse = await cloudinary.uploader.upload(
        formattedCoverImage,
        {
          folder: "covers"
        }
      );
      updatedData.coverImage = coverResponse.secure_url;
    }

    // if (req.files && req.files.chapterImages) {
    //   const chapterFiles = req.files.chapterImages;
    //   const chapterNumber = manga.chapters.length + 1;

    //   const folderName = `mangas/${slugify(updatedData.title, {
    //     lower: true,
    //     strict: true
    //   })}_${Date.now()}/chapitre_${chapterNumber}_${slugify(
    //     chapterTitle || `Chapitre ${chapterNumber}`,
    //     { lower: true, strict: true }
    //   )}`;

    //   const images = [];
    //   for (const file of chapterFiles) {
    //     const formattedImage = formatImage(file);
    //     const response = await cloudinary.uploader.upload(formattedImage, {
    //       folder: folderName
    //     });
    //     images.push(response.secure_url);
    //   }

    //   const newChapter = {
    //     title: chapterTitle || `Chapitre ${chapterNumber}`,
    //     images,
    //     folderName
    //   };
    //   updatedData.chapters = [...manga.chapters, newChapter];
    // }

    const updatedManga = await mangasService.update(id, updatedData);

    res.status(StatusCodes.OK).json({ manga: updatedManga });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du manga :", error);
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const manga = await mangasService.get(id);
    checkPermissions(req.user, manga.createdBy);

    if (!manga)
      throw new NotFoundError(`Aucun manga trouvé avec cet ID : ${id}`);

    if (manga.coverImage) {
      const coverImageId = getIdFromUrl(manga.coverImage, "covers");

      try {
        await cloudinary.uploader.destroy(coverImageId);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de la coverImage :",
          error
        );
      }
    }

    if (manga.chapters && manga.chapters.length > 0) {
      for (const chapter of manga.chapters) {
        if (chapter.folderName) {
          try {
            await cloudinary.api.delete_resources_by_prefix(chapter.folderName);

            await cloudinary.api.delete_folder(chapter.folderName);
          } catch (error) {
            console.error(
              `Erreur lors de la suppression des ressources du chapitre : ${chapter.folderName}`,
              error
            );
          }
        }
      }
    }

    const rootFolderName = manga.chapters[0].folderName.split("/chapitre_")[0];

    if (rootFolderName) {
      try {
        await cloudinary.api.delete_resources_by_prefix(rootFolderName);
        await cloudinary.api.delete_folder(rootFolderName);
      } catch (error) {
        console.error("Erreur lors de la suppression du dossier racine", error);
      }
    }

    const removedManga = await mangasService.remove(id);

    res.status(StatusCodes.OK).json({ manga: removedManga });
  } catch (error) {
    next(error);
  }
};
const getIdFromUrl = (url, folder) => {
  const parts = url.split("/");
  const id = parts[parts.length - 1].split(".")[0];
  return `${folder}/${id}`;
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
