import { createClient } from "redis";

let redis;

if (!global.redisClient) {
    redis = createClient({
        url: process.env.REDIS_URL || "redis://default:Admin123@redis:6379",
    });

    redis.on("error", (err) => console.error("Redis Client Error", err));

    // Connect hanya jika belum terkoneksi
    await redis.connect().catch((err) => {
        console.error("Redis connection failed:", err);
    });

    global.redisClient = redis;
} else {
    redis = global.redisClient;
}

export default redis;
