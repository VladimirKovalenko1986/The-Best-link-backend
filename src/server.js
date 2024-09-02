import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllLinks, getLinkById } from './services/links.js';

const PORT = Number(env('PORT', '3000'));

const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/links', async (req, res) => {
    const links = await getAllLinks();

    res.status(200).json({
      data: links,
    });
  });

  app.get('/links/:linkById', async (req, res) => {
    const { linkById } = req.params;
    const link = await getLinkById(linkById);

    if (!link) {
      res.status(404).json({
        message: 'Link not found!',
      });
      return;
    }

    res.status(200).json({
      data: link,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default startServer;
