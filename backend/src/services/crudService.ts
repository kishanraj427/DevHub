import prisma from '../lib/prisma';

type PrismaModel = keyof typeof prisma & string;

interface ListQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: string;
  search?: string;
  [key: string]: string | string[] | undefined;
}

// Allowed filterable fields per model — only these can be used as query params
const filterableFields: Record<string, string[]> = {
  user: ['email'],
  snippet: ['language', 'isPublic', 'authorId'],
  collection: ['ownerId'],
  star: ['userId', 'snippetId'],
  fork: ['userId', 'originalSnippetId'],
};

// Fields to search with `?search=` (uses contains/insensitive)
const searchableFields: Record<string, string[]> = {
  user: ['email'],
  snippet: ['title', 'description', 'code'],
  collection: ['name', 'description'],
};

const getModel = (name: string) => {
  const model = (prisma as any)[name];
  if (!model) throw new Error(`Model "${name}" not found`);
  return model;
};

const buildFilters = (model: string, query: ListQuery) => {
  const allowed = filterableFields[model] || [];
  const filters: Record<string, unknown> = {};

  for (const field of allowed) {
    if (query[field] !== undefined) {
      const value = Array.isArray(query[field]) ? query[field][0] : query[field];
      // Handle boolean strings
      if (value === 'true') filters[field] = true;
      else if (value === 'false') filters[field] = false;
      else filters[field] = value;
    }
  }

  return filters;
};

const buildSearch = (model: string, search?: string) => {
  if (!search) return {};
  const fields = searchableFields[model] || [];
  if (fields.length === 0) return {};

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    })),
  };
};

export const list = (model: string, query: ListQuery) => {
  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'createdAt';
  const order = query.order === 'asc' ? 'asc' : 'desc';

  const filters = buildFilters(model, query);
  const search = buildSearch(model, query.search);

  return getModel(model).findMany({
    where: { ...filters, ...search, deletedAt: null },
    skip,
    take: limit,
    orderBy: { [sortBy]: order },
  });
};

export const count = (model: string, query: ListQuery = {}) => {
  const filters = buildFilters(model, query);
  const search = buildSearch(model, query.search);
  return getModel(model).count({ where: { ...filters, ...search, deletedAt: null } });
};

export const getById = (model: string, id: string) => {
  return getModel(model).findUnique({ where: { id } });
};

export const create = (model: string, data: Record<string, unknown>) => {
  return getModel(model).create({ data });
};

export const update = (model: string, id: string, data: Record<string, unknown>) => {
  return getModel(model).update({ where: { id }, data });
};

export const softDelete = (model: string, id: string) => {
  return getModel(model).update({ where: { id }, data: { deletedAt: new Date() } });
};

export const isValidModel = (name: string): name is PrismaModel => {
  return name in prisma && typeof (prisma as any)[name]?.findMany === 'function';
};
