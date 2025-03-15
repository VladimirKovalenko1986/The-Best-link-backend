import path from 'node:path';

const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const nameType = [
  'HTML&CSS',
  'JS',
  'React',
  'TS',
  'Node.js',
  'Video/HTML&CSS',
  'Video/JS',
  'Video/React',
  'Video/TS',
  'Video/Node.js',
];

const authEmailFormate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const ONE_DAY = 24 * 60 * 60 * 1000;

const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

// Другий варіант
// const TEMPLATES_DIR = path.resolve('src', 'templates');

//  Це налаштування дозволить зберігати файли у визначеній дерикторії

const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'temp');

const UPLOAD_DIR = path.join(process.cwd(), 'src', 'uploads');

const UPLOAD_POSTERS_DIR = path.join(
  process.cwd(),
  'src',
  'uploads',
  'posters',
);

const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export {
  SORT_ORDER,
  nameType,
  authEmailFormate,
  FIFTEEN_MINUTES,
  ONE_DAY,
  SMTP,
  TEMPLATES_DIR,
  TEMP_UPLOAD_DIR,
  UPLOAD_DIR,
  UPLOAD_POSTERS_DIR,
  SWAGGER_PATH,
};
