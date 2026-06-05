import app from './app.js';
import env from './config/env.js';
import pool from './config/db.js';
import { connectRedis } from './config/redis.js';
import logger from './utils/logger.js';

async function start() {
  try {
    await pool.query('SELECT 1');
    logger.info('PostgreSQL connected');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to PostgreSQL');
    process.exit(1);
  }

  await connectRedis();

  const server = app.listen(env.PORT, () => {
    logger.info(`Relax Station API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
