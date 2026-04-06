import { Queue } from "bullmq";

export const gistQueue = new Queue("gist-export", {
  connection: {
    host: process.env.REDIS_HOST || "valkey",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
