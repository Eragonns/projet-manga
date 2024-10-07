import mangas from "../models/manga.model.js";

const create = (data, id) => {
  return mangas({ ...data, createdBy: id }).save();
};

const getUsersMangas = (id) => {
  return mangas.find({ createdBy: id });
};

const get = (id) => {
  return mangas.findById(id);
};

const remove = (id) => {
  return mangas.findByIdAndDelete(id);
};

const update = (id, data) => {
  return mangas.findByIdAndUpdate(id, data, {
    new: true
  });
};

export { create, getUsersMangas, get, remove, update };
