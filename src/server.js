import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import env from './utils/env.js';
import router from './routers/index-routers.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerDocs from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '3000'));

const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://the-best-link-frontend.onrender.com',
        'https://the-best-link-frontend.vercel.app',
      ], // ✅ Дозволяє фронт
      credentials: true, // ✅ Дозволяє передавати куки
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Дозволені методи
      allowedHeaders: ['Content-Type', 'Authorization'], // Явно вказати дозволені заголовки
    }),
  );

  app.options('*', cors()); // ✅ Дозволяє preflight-запити

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use(express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default startServer;
