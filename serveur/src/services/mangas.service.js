import Manga from "../models/manga.model.js";

const create = (data) => {
  return Manga(data).save();
};

const getAll = async () => {
  return Manga.find({}).select("-__v");
};

const getMostReadManga = async () => {
  const mangas = await Manga.find().sort({ reads: -1 }).limit(10);
  return mangas;
};

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

const incrementReads = async (mangaId) => {
  return Manga.findByIdAndUpdate(
    mangaId,
    { $inc: { reads: 1 } },
    { new: true }
  );
};

export {
  create,
  getAll,
  getMostReadManga,
  get,
  getChapterById,
  remove,
  update,
  addChapter,
  removeChapter,
  incrementReads
};
