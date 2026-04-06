import {
  apiErrorSchema,
  collectionOnSnippetsSchema,
  snippetSchema,
} from "@devhub/shared-schemas/schemas/";
import { toSchema } from "../helpers";

export const collectionSnippetPaths = {
  "/api/collections/{collectionId}/snippets": {
    get: {
      summary: "List snippets in a collection",
      tags: ["Collection Snippets"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "collectionId",
          in: "path" as const,
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "List of snippets in collection",
          content: {
            "application/json": {
              schema: { type: "array", items: toSchema(snippetSchema) },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
  },
  "/api/collections/{collectionId}/snippets/{snippetId}": {
    post: {
      summary: "Add snippet to collection",
      tags: ["Collection Snippets"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "collectionId",
          in: "path" as const,
          required: true,
          schema: { type: "string" },
        },
        {
          name: "snippetId",
          in: "path" as const,
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        201: {
          description: "Snippet added to collection",
          content: {
            "application/json": {
              schema: toSchema(collectionOnSnippetsSchema),
            },
          },
        },
        409: {
          description: "Snippet already in collection",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
    delete: {
      summary: "Remove snippet from collection",
      tags: ["Collection Snippets"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "collectionId",
          in: "path" as const,
          required: true,
          schema: { type: "string" },
        },
        {
          name: "snippetId",
          in: "path" as const,
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Snippet removed from collection",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { message: { type: "string" } },
              },
            },
          },
        },
        404: {
          description: "Snippet not in collection",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: toSchema(apiErrorSchema) } },
        },
      },
    },
  },
};
