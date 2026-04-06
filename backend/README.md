# DevHub Backend

Code snippet sharing platform backend built with Bun, Express, Prisma, and PostgreSQL.

## Prerequisites

- [Bun](https://bun.sh/) (v1.2+)
- [Docker](https://www.docker.com/) & Docker Compose

## Getting Started

### 1. Install dependencies

```bash
bun i
```

### 2. Start PostgreSQL

```bash
bun run start
```

To stop the database:

```bash
bun run reset
```

### 3. Setup Prisma (generate client + push schema)

```bash
bun run setup
```

### 4. Run development server

```bash
bun run dev
```

Server starts at `http://localhost:3000`.

API docs available at `http://localhost:3000/api-docs`.

### 5. Run tests

```bash
bun run test
```

Watch mode:

```bash
bun run test:watch
```

### 6. Build for production

```bash
bun run build
```

Output goes to `./dist`.

## Environment Variables

Create `.env` in the backend directory:

```env
DATABASE_URL="postgresql://devhub:devhub123@localhost:5432/devhub"
JWT_SECRET="your_super_secret_key_change_me"
PORT=3000
```

## API Endpoints

### Auth

| Method | Endpoint           | Description            | Auth |
| ------ | ------------------ | ---------------------- | ---- |
| POST   | `/api/auth/signup` | Register a new user    | No   |
| POST   | `/api/auth/login`  | Login with credentials | No   |
| GET    | `/api/auth/me`     | Get current user       | Yes  |

### Generic CRUD (all models)

| Method | Endpoint          | Description              | Auth |
| ------ | ----------------- | ------------------------ | ---- |
| GET    | `/api/:model`     | List records (paginated) | Yes  |
| GET    | `/api/:model/:id` | Get record by ID         | Yes  |
| POST   | `/api/:model`     | Create record            | Yes  |
| PUT    | `/api/:model/:id` | Update record            | Yes  |
| DELETE | `/api/:model/:id` | Soft delete record       | Yes  |

Supported models: `user`, `snippet`, `collection`, `star`, `fork`

#### List Query Params

| Param    | Default     | Description                          |
| -------- | ----------- | ------------------------------------ |
| `page`   | `1`         | Page number                          |
| `limit`  | `20`        | Items per page (max: 100)            |
| `sortBy` | `createdAt` | Field to sort by                     |
| `order`  | `desc`      | Sort direction: `asc` or `desc`      |
| `search` | —           | Text search across searchable fields |

#### Model-specific Filters

| Model        | Filters                            | Searchable Fields              |
| ------------ | ---------------------------------- | ------------------------------ |
| `snippet`    | `language`, `isPublic`, `authorId` | `title`, `description`, `code` |
| `collection` | `ownerId`                          | `name`, `description`          |
| `user`       | `email`                            | `email`                        |
| `star`       | `userId`, `snippetId`              | —                              |
| `fork`       | `userId`, `originalSnippetId`      | —                              |

Example: `GET /api/snippet?page=1&limit=10&sortBy=title&order=asc&language=typescript`

Response:

```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### Stars

| Method | Endpoint                               | Description                    | Auth |
| ------ | -------------------------------------- | ------------------------------ | ---- |
| GET    | `/api/stars`                           | Get all stars for current user | Yes  |
| POST   | `/api/stars/snippets/:snippetId`       | Toggle star on a snippet       | Yes  |
| GET    | `/api/stars/snippets/:snippetId/count` | Get star count for a snippet   | Yes  |

### Forks

| Method | Endpoint                      | Description                  | Auth |
| ------ | ----------------------------- | ---------------------------- | ---- |
| POST   | `/api/forks/:snippetId`       | Fork a snippet               | Yes  |
| GET    | `/api/forks/:snippetId/count` | Get fork count for a snippet | Yes  |

### Search

| Method | Endpoint                  | Description                             | Auth |
| ------ | ------------------------- | --------------------------------------- | ---- |
| GET    | `/api/search/snippets?q=` | Full-text search across public snippets | Yes  |

Searches `title`, `description`, and `code` fields. Returns snippets with star count.

```
GET /api/search/snippets?q=typescript
```

Response:

```json
{
  "snippets": [
    {
      "id": "...",
      "title": "TypeScript utility types",
      "description": "...",
      "code": "...",
      "language": "typescript",
      "isPublic": true,
      "authorId": "...",
      "_count": { "stars": 12 }
    }
  ],
  "success": true
}
```

## Architecture Flow

```
Request → Route → Auth Middleware → Schema Validation → Controller → Service → Prisma → DB
```

- **Route** — maps HTTP method + path to controller
- **Auth Middleware** — verifies JWT, attaches `userId` to request
- **Schema Validation** — validates request body against shared Zod schema. Fields marked `readonly()` (id, createdAt, updatedAt, deletedAt, authorId, etc.) are auto-stripped — clients cannot set them
- **Controller** — handles HTTP logic (status codes, request/response)
- **Service** — handles business logic + database interaction
- **Prisma** — ORM layer to PostgreSQL

### Shared Zod Schemas

All schemas live in `shared/schemas/` and extend a `baseSchema`:

```
baseSchema (id, createdAt, updatedAt, deletedAt — all readonly)
├── userSchema      + email, lastLoginAt (readonly)
├── snippetSchema   + title, description, code, language, isPublic, authorId (readonly)
├── collectionSchema + name, description, ownerId (readonly)
├── starSchema      + userId (readonly), snippetId
└── forkSchema      + originalSnippetId, newSnippetId (readonly), userId (readonly)
```

`readonly()` fields are auto-generated by the server and excluded from request validation on POST/PUT.

## Project Structure

```
backend/
├── src/
│   ├── index.ts                # Express app entry point
│   ├── lib/
│   │   └── prisma.ts           # Prisma client instance
│   ├── controllers/
│   │   ├── authController.ts   # Auth HTTP handlers
│   │   ├── crudController.ts   # Generic CRUD HTTP handlers
│   │   ├── starController.ts   # Star HTTP handlers
│   │   ├── forkController.ts   # Fork HTTP handlers
│   │   └── searchController.ts # Search HTTP handlers
│   ├── services/
│   │   ├── authService.ts      # Auth business logic + DB
│   │   ├── crudService.ts      # Generic CRUD operations
│   │   ├── starService.ts      # Star business logic
│   │   ├── forkService.ts      # Fork business logic
│   │   └── searchService.ts    # Full-text search logic
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   └── validate.ts         # Zod request validation
│   ├── routes/
│   │   ├── auth.route.ts       # Auth route definitions
│   │   ├── crud.route.ts       # Generic CRUD routes
│   │   ├── star.route.ts       # Star routes
│   │   ├── fork.route.ts       # Fork routes
│   │   └── search.route.ts     # Search routes
│   ├── openapi/
│   │   ├── index.ts            # OpenAPI spec entry
│   │   ├── helpers.ts          # Schema conversion utils
│   │   └── paths/
│   │       ├── auth.path.ts    # Auth endpoint docs
│   │       ├── crud.path.ts    # CRUD endpoint docs
│   │       ├── star.path.ts    # Star endpoint docs
│   │       ├── fork.path.ts    # Fork endpoint docs
│   │       └── search.path.ts  # Search endpoint docs
│   └── generated/prisma/       # Generated Prisma client (gitignored)
├── prisma/
│   ├── schema.prisma           # Prisma config + datasource
│   ├── user.prisma             # User model
│   ├── snippet.prisma          # Snippet model
│   ├── collection.prisma       # Collection model
│   ├── collection_on_snippets.prisma
│   ├── star.prisma             # Star model
│   └── form.prisma             # Fork model
├── docker-compose.yml
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

## Scripts

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `bun i`              | Install dependencies                       |
| `bun run start`      | Start PostgreSQL container                 |
| `bun run reset`      | Stop PostgreSQL container                  |
| `bun run setup`      | Generate Prisma client + push schema to DB |
| `bun run dev`        | Start dev server with hot reload           |
| `bun run test`       | Run tests                                  |
| `bun run test:watch` | Run tests in watch mode                    |
| `bun run build`      | Build for production                       |
