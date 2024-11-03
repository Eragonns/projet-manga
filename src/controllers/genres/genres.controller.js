import { StatusCodes } from "http-status-codes";
import * as genresService from "../../services/genres.service.js";

export const getMostReadGenres = async (req, res) => {
  const genres = await genresService.getMostReadGenres();
  res.status(StatusCodes.OK).json({ genres });
};
