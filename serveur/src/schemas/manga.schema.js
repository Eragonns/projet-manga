import { z } from "zod";
import mongoose from "mongoose";

import { MANGA_GENRES, MANGA_STATUS } from "../utils/constants.util.js";

const MangaParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l' ID invalide"
  })
});

const ChapterParamsSchema = z.object({
  mangaId: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l' ID de manga invalide"
  }),
  chapterId: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l' ID de chapitre invalide"
  })
});

const ChapterTextBodySchema = z.object({
  title: z
    .string()
    .max(100, {
      message: "Le titre du chapitre ne doit pas dépasser 100 caractères"
    })
    .optional()
});
const ChapterBodySchema = z.object({
  title: z
    .string()
    .max(100, {
      message: "Le titre du chapitre ne doit pas dépasser 100 caractères"
    })
    .optional(),
  images: z
    .array(z.string().url({ message: "Chaque image doit être une url valide" }))
    .min(1, "Veuillez fournir au moins une image"),
  folderName: z.string().min(1, "Veuillez fournir un nom de dossier")
});

const MangaBodySchema = z.object({
  title: z.string().trim().min(1, { message: "Le titre est requis" }),
  author: z.string().trim().min(1, { message: "L'auteur est requis" }),
  genre: z
    .array(z.enum(MANGA_GENRES))
    .min(1, { message: "Au moins un genre est requis" }),
  description: z
    .string()
    .trim()
    .min(5, { message: "La description est requise" }),
  status: z.enum([MANGA_STATUS.IN_PROGRESS, MANGA_STATUS.TO_END], {
    message: "Statut invalide"
  }),
  chapterTitle: z.string().trim().optional()
});

export {
  MangaParamsSchema,
  ChapterParamsSchema,
  MangaBodySchema,
  ChapterBodySchema,
  ChapterTextBodySchema
};
