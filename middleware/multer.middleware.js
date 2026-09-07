import multer from "multer";
import { AppError } from "../utils/errorhandler.js";

export const uploadSingleImage = (filename) =>
{

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError(402, "only allowed images"), false);
};
const uploads = multer({ storage: multerStorage, fileFilter: multerFilter });


return uploads.single(filename); 
}
