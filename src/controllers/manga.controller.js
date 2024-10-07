import { v2 as cloudinary } from "cloudinary";

import { formatImage } from "../middlewares/multer.middleware.js";
import * as mangasService from "../services/mangas.service.js";

const create = async (req, res) => {
  const productImage = req.file;

  if (!productImage) {
    throw new Error("Aucun fichier fourni");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new Error("Veuillez fournir une image de taille inferieur a 1Mo");
  }
  const file = formatImage(productImage);
  const response = await cloudinary.uploader.upload(file, {
    folder: "mangas"
  });
  const images = [response.secure_url];

  const newManga = { ...req.body, images };
  const manga = await mangasService.create(newManga);
  res.status(201).json({ manga });
};

const getAll = async (req, res) => {
  const mangas = await mangasService.getAll();
  res.status(200).json({ mangas });
};

export { create, getAll };
