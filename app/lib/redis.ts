import "server-only";

import { createClient, RedisClientType } from "redis";
import { logger } from "@/app/lib/logger";

const globalForRedis = global as unknown as { redis: RedisClientType };

export const redis: RedisClientType =
  globalForRedis.redis || createClient({ url: process.env.REDIS_URL });

if (!redis.isOpen) {
  try {
    redis.on("error", (err) => logger.error("Redis client error", err));
    await redis.connect();
  } catch (err) {
    logger.error("Failed to connect Redis client", err);
  }
}

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
