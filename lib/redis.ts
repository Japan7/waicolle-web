import Redis from "ioredis";

export const redis = new Redis(
  (process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT)) || 6379,
  process.env.REDIS_HOST || "localhost"
);
