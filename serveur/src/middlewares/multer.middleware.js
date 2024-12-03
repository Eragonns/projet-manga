import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "node:path";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log("test:", req.body);

    const filetypes = /jpeg|jpg|png|gif/;
    const mimetypes = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetypes && extname) {
      return cb(null, true);
    }
    cb(new Error("Seuls les fichiers d'images sont autorisés ."));
  }
}).fields([
  { name: "coverImage", maxCount: 1 },
  { name: "mangas", maxCount: 100 },
  { name: "chapterImages", maxCount: 100 },
  { name: "profileImage", maxCount: 1 }
]);

const parser = new DataParser();

export const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
