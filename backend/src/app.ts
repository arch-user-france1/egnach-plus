import express from 'express';
import { cors } from './middleware/cors.js';
import { errorHandler } from './lib/errors.js';
import apiRouter from './routes/index.js';

export function createApp() {
  const app = express();
  app.use(cors);
  app.use(express.json());
  app.use('/api/v1', apiRouter);
  app.use(errorHandler);
  return app;
}
