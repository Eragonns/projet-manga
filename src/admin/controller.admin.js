import * as mangasService from "../mangas/service.manga.js";

export const createManga = async (req, res) => {
  const { title, genre, status } = req.body;
  const images = req.files ? req.files.map((file) => file.path) : [];

  const newManga = await mangasService.create({ title, genre, status, images });
  res.status(201).json({ manga: newManga });
};

export const getAllMangas = async (req, res) => {
  const mangas = await mangasService.getAll();
  res.status(200).json({ mangas });
};
