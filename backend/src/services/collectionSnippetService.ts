import prisma from '../lib/prisma';

export const addSnippetToCollection = (collectionId: string, snippetId: string) => {
  return prisma.collectionOnSnippets.create({
    data: { collectionId, snippetId },
  });
};

export const removeSnippetFromCollection = (collectionId: string, snippetId: string) => {
  return prisma.collectionOnSnippets.delete({
    where: { snippetId_collectionId: { snippetId, collectionId } },
  });
};

export const getSnippetsByCollection = (collectionId: string) => {
  return prisma.collectionOnSnippets.findMany({
    where: { collectionId, deletedAt: null },
    include: { snippet: true },
  });
};

export const getCollectionsBySnippet = (snippetId: string) => {
  return prisma.collectionOnSnippets.findMany({
    where: { snippetId, deletedAt: null },
    include: { collection: true },
  });
};

export const isSnippetInCollection = (collectionId: string, snippetId: string) => {
  return prisma.collectionOnSnippets.findUnique({
    where: { snippetId_collectionId: { snippetId, collectionId } },
  });
};
