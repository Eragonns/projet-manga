import Manga from "../models/manga.model.js";

const create = (data) => {
  return Manga(data).save();
};

const getAll = () => {
  return Manga.find({});
};

const getUsersMangas = (id) => {
  return Manga.find({ createdBy: id });
};

const get = (id) => {
  return Manga.findById(id);
};

const remove = (id) => {
  return Manga.findByIdAndDelete(id);
};

const update = (id, data) => {
  return Manga.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

export { create, getAll, getUsersMangas, get, remove, update };
