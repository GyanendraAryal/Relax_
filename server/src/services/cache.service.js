import { getRedis } from '../config/redis.js';

const DEFAULT_TTL = 300;

export async function cacheGet(key) {
  const redis = getRedis();
  if (!redis) return null;
  const val = await redis.get(key);
  return val ? JSON.parse(val) : null;
}

export async function cacheSet(key, value, ttlSeconds = DEFAULT_TTL) {
  const redis = getRedis();
  if (!redis) return;
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
}

export async function cacheDel(pattern) {
  const redis = getRedis();
  if (!redis) return;
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(...keys);
}
