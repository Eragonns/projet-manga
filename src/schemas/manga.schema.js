import { z } from "zod";
import mongoose from "mongoose";

import { MANGA_STATUS } from "../utils/constants.util.js";

const MangaParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l' ID invalide"
  })
});

const ChapterBodySchema = z.object({
  title: z
    .string()
    .max(100, {
      message: "Le titre du chapitre ne doit pas dépasser 100 caractères"
    })
    .min(1, "Veuillez fournir un titre pour le chapitre"),
  images: z
    .array(z.string().url({ message: "Chaque image doit être une url valide" }))
    .min(1, "Veuillez fournir au moins une image"),
  folderName: z.string().min(1, "Veuillez fournir un nom de dossier")
});

const MangaBodySchema = z.object({
  title: z.string().trim().min(1, { message: "Le titre est requis" }),
  author: z.string().trim().min(1, { message: "L'auteur est requis" }),
  genre: z.string().trim().min(1, { message: "Le genre est requis" }),
  status: z.enum([MANGA_STATUS.IN_PROGRESS, MANGA_STATUS.TO_END], {
    message: "Statut invalide"
  })
});

export { MangaParamsSchema, MangaBodySchema, ChapterBodySchema };
