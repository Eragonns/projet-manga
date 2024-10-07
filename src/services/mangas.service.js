import Manga from "../models/manga.model.js";

const getAll = () => {
  return Manga.find({});
};

const create = (data) => {
  return Manga(data).save();
};

export { create, getAll };
