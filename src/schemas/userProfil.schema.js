import * as z from "zod";
import { MANGA_GENRES } from "../utils/constants.util.js";

const UpdateProfileSchema = z.object({
  pseudo: z
    .string()
    .trim()
    .min(3, { message: "Doit avoir au minimum 3 caractères" })
    .max(20, { message: "Doit avoir au maximum 20 caractères" }),
  name: z
    .string()
    .trim()
    .min(3, { message: "Doit avoir au minimum 3 caractères" })
    .max(20, { message: "Doit avoir au maximum 20 caractères" }),
  firstName: z
    .string()
    .trim()
    .min(3, { message: "Doit avoir au minimum 3 caractères" })
    .max(20, { message: "Doit avoir au maximum 20 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  description: z.string().trim(),
  age: z.coerce.number().min(0).max(120).optional(),
  genre: z
    .array(z.enum(MANGA_GENRES))
    .min(1, { message: "Au moins un genre est requis" }),
  profileImage: z.string().optional()
});

export { UpdateProfileSchema };
