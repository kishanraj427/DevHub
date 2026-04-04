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

### 2. Setup (database + Prisma)

Starts PostgreSQL via Docker and generates Prisma client + pushes schema to DB:

```bash
bun run setup
```

### 3. Run development server

```bash
bun run dev
```

Server starts at `http://localhost:3000`.

### 4. Run tests

```bash
bun run test
```

Watch mode:

```bash
bun run test:watch
```

### 5. Build for production

```bash
bun run build
```

Output goes to `./dist`.

## Environment Variables

Copy `.env.example` or create `.env`:

```env
DATABASE_URL="postgresql://devhub:devhub123@localhost:5432/devhub"
JWT_SECRET="your_super_secret_key_change_me"
PORT=3000
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express app entry point
│   └── generated/prisma/     # Generated Prisma client (gitignored)
├── prisma/
│   ├── schema.prisma         # Prisma config + datasource
│   ├── user.prisma           # User model
│   ├── snippet.prisma        # Snippet model
│   ├── collection.prisma     # Collection model
│   ├── collection_on_snippets.prisma
│   ├── star.prisma           # Star model
│   └── form.prisma           # Fork model
├── docker-compose.yml        # PostgreSQL container
├── package.json
└── tsconfig.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun i` | Install dependencies |
| `bun run setup` | Start DB + generate Prisma client + push schema |
| `bun run dev` | Start dev server with hot reload |
| `bun run test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run build` | Build for production |
