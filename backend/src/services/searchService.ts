import prisma from "../lib/prisma";

export const searchSnippetsService = async (q: string) => {
  const snippets = await prisma.snippet.findMany({
    where: {
      OR: [
        { title: { search: q } },
        { description: { search: q } },
        { code: { search: q } },
      ],
      isPublic: true,
    },
    include: { _count: { select: { stars: true } } },
  });
  return snippets;
};
