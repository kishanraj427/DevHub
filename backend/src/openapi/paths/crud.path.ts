import { z } from "zod";
import {
  apiSuccessSchema,
  apiErrorSchema,
} from "@devhub/shared-schemas/schemas/";
import {
  snippetSchema,
  collectionSchema,
  starSchema,
  forkSchema,
  userSchema,
} from "@devhub/shared-schemas/schemas/";
import { toSchema } from "../helpers";

const idParam = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string" },
};

const baseListParams = [
  {
    name: "page",
    in: "query" as const,
    schema: { type: "string", default: "1" },
    description: "Page number",
  },
  {
    name: "limit",
    in: "query" as const,
    schema: { type: "string", default: "20" },
    description: "Items per page (max: 100)",
  },
  {
    name: "sortBy",
    in: "query" as const,
    schema: { type: "string", default: "createdAt" },
    description: "Field to sort by",
  },
  {
    name: "order",
    in: "query" as const,
    schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
    description: "Sort direction",
  },
  {
    name: "search",
    in: "query" as const,
    schema: { type: "string" },
    description: "Search text across searchable fields",
  },
];

const modelFilterParams: Record<
  string,
  {
    name: string;
    in: "query";
    schema: Record<string, string>;
    description: string;
  }[]
> = {
  user: [
    {
      name: "email",
      in: "query",
      schema: { type: "string" },
      description: "Filter by email",
    },
  ],
  snippet: [
    {
      name: "language",
      in: "query",
      schema: { type: "string" },
      description: "Filter by language",
    },
    {
      name: "isPublic",
      in: "query",
      schema: { type: "string", enum: "true,false" },
      description: "Filter by visibility",
    },
    {
      name: "authorId",
      in: "query",
      schema: { type: "string" },
      description: "Filter by author",
    },
  ],
  collection: [
    {
      name: "ownerId",
      in: "query",
      schema: { type: "string" },
      description: "Filter by owner",
    },
  ],
  star: [
    {
      name: "userId",
      in: "query",
      schema: { type: "string" },
      description: "Filter by user",
    },
    {
      name: "snippetId",
      in: "query",
      schema: { type: "string" },
      description: "Filter by snippet",
    },
  ],
  fork: [
    {
      name: "userId",
      in: "query",
      schema: { type: "string" },
      description: "Filter by user",
    },
    {
      name: "originalSnippetId",
      in: "query",
      schema: { type: "string" },
      description: "Filter by original snippet",
    },
  ],
};

const generateCrudPaths = (model: string, tag: string, schema: z.ZodType) => ({
  [`/api/${model}`]: {
    get: {
      summary: `List ${tag}s`,
      tags: [tag],
      security: [{ BearerAuth: [] }],
      parameters: [...baseListParams, ...(modelFilterParams[model] || [])],
      responses: {
        200: {
          description: `List of ${tag}s`,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: { type: "array", items: toSchema(schema) },
                  total: { type: "integer" },
                  page: { type: "integer" },
                  limit: { type: "integer" },
                  totalPages: { type: "integer" },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
    post: {
      summary: `Create ${tag}`,
      tags: [tag],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: toSchema(schema) } },
      },
      responses: {
        201: {
          description: `${tag} created`,
          content: { "application/json": { schema: toSchema(schema) } },
        },
        400: {
          description: "Validation error",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
  },
  [`/api/${model}/{id}`]: {
    get: {
      summary: `Get ${tag} by ID`,
      tags: [tag],
      security: [{ BearerAuth: [] }],
      parameters: [idParam],
      responses: {
        200: {
          description: tag,
          content: { "application/json": { schema: toSchema(schema) } },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
        404: {
          description: "Not found",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
    put: {
      summary: `Update ${tag}`,
      tags: [tag],
      security: [{ BearerAuth: [] }],
      parameters: [idParam],
      requestBody: {
        required: true,
        content: { "application/json": { schema: toSchema(schema) } },
      },
      responses: {
        200: {
          description: `${tag} updated`,
          content: { "application/json": { schema: toSchema(schema) } },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
        400: {
          description: "Validation error",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
        404: {
          description: "Not found",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
    delete: {
      summary: `Delete ${tag}`,
      tags: [tag],
      security: [{ BearerAuth: [] }],
      parameters: [idParam],
      responses: {
        200: {
          description: `${tag} deleted`,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { message: { type: "string" } },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
        404: {
          description: "Not found",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
  },
});

export const crudPaths = {
  ...generateCrudPaths("user", "User", userSchema),
  ...generateCrudPaths("snippet", "Snippet", snippetSchema),
  ...generateCrudPaths("collection", "Collection", collectionSchema),
  ...generateCrudPaths("star", "Star", starSchema),
  ...generateCrudPaths("fork", "Fork", forkSchema),
};
