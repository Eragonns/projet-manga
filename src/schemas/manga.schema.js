import { z } from "zod";
import mongoose from "mongoose";

import { MANGA_STATUS } from "../utils/constants.util.js";

const MangaParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l' ID invalide"
  })
});

const MangaBodySchema = z.object({
  title: z.string().trim().min(1, { message: "Le titre est requis" }),
  author: z.string().trim().min(1, { message: "L'auteur est requis" }),
  genre: z.string().trim().min(1, { message: "Le genre est requis" }),
  status: z.enum([MANGA_STATUS.IN_PROGRESS, MANGA_STATUS.TO_END], {
    message: "Statut invalide"
  }),
  images: z.array(z.string().max(200, "URL de l'image trop longue")).optional()
});

export { MangaParamsSchema, MangaBodySchema };
