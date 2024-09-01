import startServer from './server.js';
import initMongoDB from './db/initialMongoDB.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
