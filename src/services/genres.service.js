import Manga from "../models/manga.model.js";

export const getMostReadGenres = async () => {
  const genres = await Manga.aggregate([
    { $unwind: "$genres" },
    { $group: { _id: "$genres", totalReads: { $sum: "$reads" } } },
    { $sort: { totalReads: -1 } },
    { $limit: 4 }
  ]);
  return genres;
};
