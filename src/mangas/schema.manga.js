import { z } from "zod";
import mongoose from "mongoose";

import { MANGA_STATUS } from "../utils/constants.util.js";

const MangaParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l' ID invalide"
  })
});

const MangaBodySchema = z.object({
  title: z.string().trim().min(1),

  genre: z.string().trim().min(1),

  status: z.enum([MANGA_STATUS.IN_PROGRESS, MANGA_STATUS.TO_END])
});

export { MangaParamsSchema, MangaBodySchema };
