import { model, Schema } from "mongoose";
import { MANGA_STATUS } from "../utils/constants.util.js";

const ChapterSchema = new Schema(
  {
    title: {
      type: String,
      // required: [true, "Veuillez fournir un titre pour le chapitre"],
      maxlength: 200
    },
    images: [
      {
        type: String,
        required: true,
        maxlength: 500
      }
    ],
    folderName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const MangaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Veuillez fournir un titre"],
      maxlength: 200
    },
    author: {
      type: String,
      required: [true, "Veuillez fournir le nom de l'auteur"]
    },
    genre: {
      type: [String],
      required: [true, "Veuillez fournir un genre"],
      maxlength: 20
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: [MANGA_STATUS.IN_PROGRESS, MANGA_STATUS.TO_END],
      default: MANGA_STATUS.IN_PROGRESS
    },
    coverImage: {
      type: String,
      required: true
    },
    chapters: [ChapterSchema],
    reads: {
      type: Number,
      default: 0
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default model("Manga", MangaSchema);
