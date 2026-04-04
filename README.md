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
├── backend/    # Express API server
├── frontend/   # (coming soon)
├── shared/     # Shared Zod schemas & types
├── biome.json  # Linter + formatter config
└── .github/workflows/ci.yml
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

| Command | Description |
|---------|-------------|
| `bun i` | Install all workspace dependencies |
| `bun run lint` | Lint entire project |
| `bun run lint:fix` | Lint and auto-fix |
| `bun run format` | Format entire project |

See [backend/README.md](backend/README.md) for backend-specific commands.

## Workspaces

| Package | Path | Description |
|---------|------|-------------|
| `backend` | `./backend` | Express API with Prisma + PostgreSQL |
| `@devhub/shared-schemas` | `./shared` | Shared Zod schemas and TypeScript types |
| `frontend` | `./frontend` | Frontend app (coming soon) |
