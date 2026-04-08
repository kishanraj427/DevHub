import { createClient, type UserConfig } from "@hey-api/openapi-ts";
import {
  createDocument,
  type ZodOpenApiObject,
} from "zod-openapi";
import openApiSpec from "../backend/src/openapi/index";

const createOpenAPISchema = (openApi: ZodOpenApiObject) => {
  return createDocument(openApi, {
    override: ({ jsonSchema, io }) => {
      // biome-ignore lint/complexity/useLiteralKeys: index signature requires bracket notation
      if (jsonSchema["ui"]) {
        // biome-ignore lint/complexity/useLiteralKeys: index signature requires bracket notation
        delete jsonSchema["ui"];
      }
      if (jsonSchema.required && jsonSchema.properties && io === "input") {
        jsonSchema.required = jsonSchema.required.filter((property) => {
          const propObj = jsonSchema.properties?.[property] as
            | { readOnly?: boolean }
            | undefined;
          return !propObj?.readOnly;
        });
      }

      if (jsonSchema.properties) {
        Object.entries(jsonSchema.properties).forEach(([key, value]) => {
          if (
            value &&
            typeof value === "object" &&
            "const" in value &&
            value.const &&
            jsonSchema.properties
          ) {
            if (value.type) {
              jsonSchema.properties[key] = {
                type: value.type,
              };
            }
          }
        });
      }
    },
  });
};

const backendClientConfig: UserConfig = {
  input: JSON.parse(
    JSON.stringify(createOpenAPISchema(openApiSpec as ZodOpenApiObject)),
  ),
  output: {
    path: "./src/generated/client/backend",
    postProcess: ["biome:lint", "prettier"],
  },
  plugins: [
    "@hey-api/client-axios",
    "@tanstack/react-query",
    {
      name: "@hey-api/typescript",
      enums: "javascript",
    },
  ],
};

export const clients = [createClient(backendClientConfig)];
