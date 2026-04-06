import { apiErrorSchema } from "@devhub/shared-schemas/schemas/";
import { z } from "zod";
import { toSchema } from "../helpers";

export const gistPaths = {
  "/api/gist/export": {
    post: {
      operationId: "exportGist",
      summary: "Export a snippet to GitHub Gist",
      description:
        "Queues an async job to export the snippet as a GitHub Gist. The GitHub token must be passed as the Bearer token in the Authorization header.",
      tags: ["Gist"],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: toSchema(
              z.object({
                snippetId: z
                  .string()
                  .min(1)
                  .describe("ID of the snippet to export"),
              }),
            ),
          },
        },
      },
      responses: {
        200: {
          description: "Gist export job queued successfully",
          content: {
            "application/json": {
              schema: toSchema(
                z.object({
                  message: z.string(),
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
          description: "Failed to queue gist export job",
          content: {
            "application/json": { schema: toSchema(apiErrorSchema) },
          },
        },
      },
    },
  },
};
