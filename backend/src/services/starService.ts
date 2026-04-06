import prisma from "../lib/prisma";

export const toggleStarService = async (userId: string, snippetId: string) => {
  const existingStar = await prisma.star.findUnique({
    where: { userId_snippetId: { userId, snippetId } },
  });

  if (existingStar) {
    await prisma.star.delete({
      where: { userId_snippetId: { userId, snippetId } },
    });
    return false;
  } else {
    await prisma.star.create({
      data: { userId, snippetId },
    });
    return true;
  }
};

export const getStarsForUserService = async (userId: string) => {
  const stars = await prisma.star.findMany({
    where: { userId },
    select: { snippetId: true }, // Only select the snippetId to return an array of starred snippet IDs
  });
  return stars.map((star) => star.snippetId);
};

export const getStarsCountService = async (snippetId: string) => {
  const count = await prisma.star.count({
    where: { snippetId },
  });
  return count;
};
