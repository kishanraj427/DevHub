import { Worker } from "bullmq";
import axios from "axios";
import prisma from "../lib/prisma";

const worker = new Worker(
  "gist-export",
  async (job) => {
    const { snippetId, userId, githubToken } = job.data;

    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
    });

    if (!snippet) throw new Error("Snippet not found");

    const response = await axios.post(
      "https://api.github.com/gists",
      {
        description: snippet.title,
        public: false,
        files: {
          [`${snippet.title}.${snippet.language.toLowerCase()}`]: {
            content: snippet.code,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      },
    );

    await prisma.snippet.update({
      where: { id: snippetId },
      data: { gistUrl: response.data.html_url },
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "valkey",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`Gist export job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Gist export job ${job?.id} failed:`, err.message);
});
