import {
  apiErrorSchema,
  searchSnippetsResponseSchema,
} from "@devhub/shared-schemas/schemas/";
import { toSchema } from "../helpers";

export const searchPaths = {
  "/api/search/snippets": {
    get: {
      operationId: "searchSnippets",
      summary: "Search public snippets by title, description, or code",
      tags: ["Search"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          schema: { type: "string" },
          description: "Search query",
        },
      ],
      responses: {
        200: {
          description: "Matching snippets",
          content: {
            "application/json": {
              schema: toSchema(searchSnippetsResponseSchema),
            },
          },
        },
        400: {
          description: "Missing query parameter",
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
