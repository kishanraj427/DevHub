# DevHub

A code snippet sharing platform — monorepo powered by Bun workspaces.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Backend**: Express, Prisma, PostgreSQL, JWT, Zod v4
- **Shared**: Zod schemas (validation + OpenAPI spec generation)
- **Linting/Formatting**: Biome
- **CI/CD**: GitHub Actions

## Monorepo Structure

```
DevHub/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── collectionSnippetController.ts
│   │   │   ├── crudController.ts
│   │   │   ├── forkController.ts
│   │   │   ├── gistController.ts
│   │   │   ├── searchController.ts
│   │   │   └── starController.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── collectionSnippetService.ts
│   │   │   ├── crudService.ts
│   │   │   ├── forkService.ts
│   │   │   ├── gistService.ts
│   │   │   ├── searchService.ts
│   │   │   └── starService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validate.ts
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   ├── collectionSnippet.route.ts
│   │   │   ├── crud.route.ts
│   │   │   ├── fork.route.ts
│   │   │   ├── gist.route.ts
│   │   │   ├── search.route.ts
│   │   │   └── star.route.ts
│   │   ├── queue/
│   │   │   └── gistQueue.ts
│   │   ├── worker/
│   │   │   └── gistWorker.ts
│   │   └── openapi/
│   │       ├── index.ts
│   │       ├── helpers.ts
│   │       └── paths/
│   │           ├── auth.path.ts
│   │           ├── collectionSnippet.path.ts
│   │           ├── crud.path.ts
│   │           ├── fork.path.ts
│   │           ├── gist.path.ts
│   │           ├── search.path.ts
│   │           └── star.path.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── collection.prisma
│   │   ├── collection_on_snippets.prisma
│   │   ├── form.prisma
│   │   ├── snippet.prisma
│   │   ├── star.prisma
│   │   ├── user.prisma
│   │   └── migrations/
│   │       └── 20260406000000_add_snippet_fulltext_search/
│   │           └── migration.sql
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── collectionSnippet.test.ts
│   │   ├── crud.test.ts
│   │   ├── fork.test.ts
│   │   ├── gist.test.ts
│   │   ├── health.test.ts
│   │   ├── schemas.test.ts
│   │   ├── search.test.ts
│   │   ├── star.test.ts
│   │   └── validate.test.ts
│   ├── docker-compose.yml
│   ├── prisma.config.ts
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   └── schemas/
│       ├── index.ts
│       ├── api.schema.ts
│       ├── base.schema.ts
│       ├── auth/
│       │   └── auth.schema.ts
│       ├── collection/
│       │   └── collection.schema.ts
│       ├── collectionOnSnippets/
│       │   └── collectionOnSnippets.schema.ts
│       ├── fork/
│       │   └── fork.schema.ts
│       ├── snippet/
│       │   └── snippet.schema.ts
│       └── star/
│           └── star.schema.ts
├── frontend/         # (coming soon)
├── biome.json
├── bunfig.toml
└── package.json
```

## Prerequisites

- [Bun](https://bun.sh/) (v1.2+)
- [Docker](https://www.docker.com/) & Docker Compose

## Quick Start

```bash
# Install all workspace dependencies
bun i

# Start database + setup Prisma
cd backend
bun run start
bun run setup

# Run dev server
bun run dev
```

## Root Scripts

Run from the project root:

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `bun i`            | Install all workspace dependencies |
| `bun run lint`     | Lint entire project                |
| `bun run lint:fix` | Lint and auto-fix                  |
| `bun run format`   | Format entire project              |

See [backend/README.md](backend/README.md) for backend-specific commands.

## Workspaces

| Package                  | Path         | Description                             |
| ------------------------ | ------------ | --------------------------------------- |
| `backend`                | `./backend`  | Express API with Prisma + PostgreSQL    |
| `@devhub/shared-schemas` | `./shared`   | Shared Zod schemas and TypeScript types |
| `frontend`               | `./frontend` | Frontend app (coming soon)              |
