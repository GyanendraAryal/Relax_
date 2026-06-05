import Redis from 'ioredis';
import env from './env.js';
import logger from '../utils/logger.js';

let redis = null;

if (env.REDIS_ENABLED && env.REDIS_URL) {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
  });

  redis.on('error', (err) => {
    logger.warn({ err }, 'Redis connection error');
  });
}

export async function connectRedis() {
  if (!redis) return null;
  try {
    await redis.ping();
    logger.info('Redis connected');
    return redis;
  } catch (err) {
    logger.warn({ err }, 'Redis unavailable, continuing without cache');
    redis = null;
    return null;
  }
}

export function getRedis() {
  return redis;
}

export default redis;
