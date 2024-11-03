import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../constants/index.js';

const saveFileToUploadsDir = async (file, filePath) => {
  const newPath = path.join(UPLOAD_DIR, filePath, file.filename);
  await fs.rename(file.path, newPath);

  return `${filePath}/${file.filename}`;
};

export default saveFileToUploadsDir;
