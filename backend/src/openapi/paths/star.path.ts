import {
  starSchema,
  apiErrorSchema,
  toggleStarResponseSchema,
  starsCountResponseSchema,
} from "@devhub/shared-schemas/schemas/";
import { z } from "zod";
import { toSchema } from "../helpers";

export const starPaths = {
  "/api/stars": {
    get: {
      operationId: "getStarsForUser",
      summary: "Get all stars for the authenticated user",
      tags: ["Stars"],
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "List of starred snippets",
          content: {
            "application/json": {
              schema: toSchema(
                z.object({
                  stars: z.array(starSchema),
                  success: z.literal(true),
                }),
              ),
            },
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
  "/api/stars/snippets/{snippetId}": {
    get: {
      operationId: "toggleStar",
      summary: "Toggle star on a snippet",
      tags: ["Stars"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "snippetId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "The snippet ID to star/unstar",
        },
      ],
      responses: {
        200: {
          description: "Star toggled",
          content: {
            "application/json": {
              schema: toSchema(toggleStarResponseSchema),
            },
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
  "/api/stars/{starId}/count": {
    get: {
      operationId: "getStarsCount",
      summary: "Get star count for a snippet",
      tags: ["Stars"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "starId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "The star/snippet ID to get count for",
        },
      ],
      responses: {
        200: {
          description: "Star count",
          content: {
            "application/json": {
              schema: toSchema(starsCountResponseSchema),
            },
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
