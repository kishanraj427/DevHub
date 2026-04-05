import { authPaths } from './paths/auth.path';
import { crudPaths } from './paths/crud.path';
import { collectionSnippetPaths } from './paths/collectionSnippet.path';

const openApiSpec = {
  openapi: '3.0.0',
  info: { title: 'DevHub API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    ...authPaths,
    ...crudPaths,
    ...collectionSnippetPaths,
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export default openApiSpec;
