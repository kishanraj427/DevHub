import prisma from "../lib/prisma";

export const createForkService = async (userId: string, snippetId: string) => {
  // Check if the original snippet exists
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });
  // If the original snippet doesn't exist, throw an error
  if (!snippet) {
    throw new Error("Snippet not found");
  }
  // Create a new snippet based on the original snippet's data
  const { id, createdAt, updatedAt, deletedAt, authorId: _, ...snippetData } = snippet;
  const newSnippet = await prisma.snippet.create({
    data: {
      ...snippetData,
      authorId: userId,
      title: `Fork of ${snippet.title}`,
    },
  });
  // Create a new fork record linking the user, original snippet, and new snippet
  const fork = await prisma.fork.create({
    data: {
      userId,
      originalSnippetId: snippetId,
      newSnippetId: newSnippet.id,
    },
  });
  // Return the newly created fork record
  return fork;
};

export const getForkCountService = async (snippetId: string) => {
  // Count the number of forks for the given snippet ID
  const count = await prisma.fork.count({
    where: {
      originalSnippetId: snippetId,
    },
  });
  return count;
};
