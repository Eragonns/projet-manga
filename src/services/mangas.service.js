import Manga from "../models/manga.model.js";

const create = (data) => {
  return Manga(data).save();
};

const getAll = async () => {
  return Manga.find({}).select("-__v");
};

// const getUsersMangas = (id) => {
//   return Manga.find({ createdBy: id });
// };

const get = async (mangaId) => {
  return Manga.findById(mangaId).populate("chapters");
};

const getChapterById = async (mangaId, chapterId) => {
  const manga = await Manga.findById(mangaId);
  if (!manga) return null;

  const chapter = manga.chapters.id(chapterId);
  return chapter;
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

export {
  create,
  getAll,
  get,
  getChapterById,
  remove,
  update,
  addChapter,
  removeChapter
};
