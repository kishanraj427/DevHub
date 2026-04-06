import { gistQueue } from "@/queue/gistQueue";

export const addGistExportJob = async (
  snippetId: string,
  userId: string,
  githubToken: string,
) => {
  return gistQueue.add(
    "export-gist",
    {
      snippetId,
      userId,
      githubToken,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  );
};
