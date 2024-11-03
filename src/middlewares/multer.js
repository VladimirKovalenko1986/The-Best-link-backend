import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,

  filename: (req, file, callback) => {
    const uniquePreffix = Date.now();
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

// Не обовʼязкове
const limits = {
  // Ліміт до 5мб розиір файлу
  fileSize: 1024 * 1024 * 5,
};

// Робимо для того щоб заборонити відправку файлу з розширенням exe
const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();

  if (extension === 'exe') {
    return callback(createHttpError(400, '.exe file not allow'));
  }

  callback(null, true);
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
