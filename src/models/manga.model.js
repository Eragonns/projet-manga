import { model, Schema } from "mongoose";

import { MANGA_STATUS } from "../utils/constants.util.js";

const MangaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Veuillez fournir un titre"],
      maxlength: 50
    },
    author: {
      type: String
      // required: [true, "Veuillez fournir le nom de l'autheur"]
    },
    genre: {
      type: String,
      required: [true, "Veuillez fournir un genre"],
      maxlength: 20
    },
    status: {
      type: String,
      enum: [MANGA_STATUS.IN_PROGRESS, MANGA_STATUS.TO_END],
      default: MANGA_STATUS.IN_PROGRESS
    },
    images: [
      {
        type: String,
        required: true,
        maxlength: 200
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default model("manga", MangaSchema);
