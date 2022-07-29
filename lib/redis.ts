import { createClient } from "redis";

const url = process.env.REDIS_URL || "redis://localhost:6379";

const redis = createClient({ url });
redis.on("error", (err) => console.error("Redis Client Error", err));
redis.connect();

export default redis;
