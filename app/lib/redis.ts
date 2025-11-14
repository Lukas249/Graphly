import "server-only";

import { createClient, RedisClientType } from "redis";

const globalForRedis = global as unknown as { redis: RedisClientType };

export const redis: RedisClientType =
  globalForRedis.redis || createClient({ url: process.env.REDIS_URL });

if (!redis.isOpen) {
  try {
    redis.on("error", (err) => console.log("Redis Client Error", err));
    await redis.connect();
  } catch (err) {
    console.error(err);
  }
}

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
