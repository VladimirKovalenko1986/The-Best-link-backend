import startServer from './server.js';
import initMongoDB from './db/initialMongoDB.js';
import createDirIfNotExists from './utils/createDirIfNotExists.js';
import {
  TEMP_UPLOAD_DIR,
  UPLOAD_DIR,
  UPLOAD_POSTERS_DIR,
} from './constants/index.js';

const bootstrap = async () => {
  await initMongoDB();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_POSTERS_DIR);
  startServer();
};

void bootstrap();
