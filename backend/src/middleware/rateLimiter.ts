import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "valkey",
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redisClient.call(command, ...args) as Promise<
        import("rate-limit-redis").RedisReply
      >,
  }),
  windowMs: 60 * 1000, // 1 minute
  limit: 100,
  keyGenerator: (req) => (req as any).userId || req.ip,
  skipFailedRequests: false,
});
