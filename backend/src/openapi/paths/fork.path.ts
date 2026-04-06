import {
  forkSchema,
  apiErrorSchema,
  createForkResponseSchema,
  forkCountResponseSchema,
} from "@devhub/shared-schemas/schemas/";
import { toSchema } from "../helpers";

export const forkPaths = {
  "/api/forks/{snippetId}": {
    post: {
      operationId: "createFork",
      summary: "Fork a snippet",
      tags: ["Forks"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "snippetId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "The ID of the snippet to fork",
        },
      ],
      responses: {
        201: {
          description: "Fork created successfully",
          content: {
            "application/json": {
              schema: toSchema(createForkResponseSchema),
            },
          },
        },
        400: {
          description: "Invalid snippet ID",
          content: {
            "application/json": { schema: toSchema(apiErrorSchema) },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": { schema: toSchema(apiErrorSchema) },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": { schema: toSchema(apiErrorSchema) },
          },
        },
      },
    },
  },
  "/api/forks/{snippetId}/count": {
    get: {
      operationId: "getForkCount",
      summary: "Get fork count for a snippet",
      tags: ["Forks"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "snippetId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "The ID of the snippet to get fork count for",
        },
      ],
      responses: {
        200: {
          description: "Fork count",
          content: {
            "application/json": {
              schema: toSchema(forkCountResponseSchema),
            },
          },
        },
        400: {
          description: "Invalid snippet ID",
          content: {
            "application/json": { schema: toSchema(apiErrorSchema) },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": { schema: toSchema(apiErrorSchema) },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": { schema: toSchema(apiErrorSchema) },
          },
        },
      },
    },
  },
};
