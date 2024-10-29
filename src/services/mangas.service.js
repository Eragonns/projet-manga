import Manga from "../models/manga.model.js";

const create = (data) => {
  return Manga(data).save();
};

const getAll = () => {
  return Manga.find({});
};

// const getUsersMangas = (id) => {
//   return Manga.find({ createdBy: id });
// };

const get = (id) => {
  return Manga.findById(id);
};

const remove = (id) => {
  return Manga.findByIdAndDelete(id);
};

const update = (id, updateData) => {
  console.log("updateData", updateData);

  return Manga.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

const addChapter = (mangaId, chapter) => {
  return Manga.findByIdAndUpdate(
    mangaId,
    { $push: { chapters: chapter } },
    { new: true, runValidators: true }
  );
};

const removeChapter = (mangaId, chapterId) => {
  return Manga.findByIdAndUpdate(
    mangaId,
    { $pull: { chapters: { _id: chapterId } } },
    { new: true }
  );
};

export { create, getAll, get, remove, update, addChapter, removeChapter };
