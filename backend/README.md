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

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login with credentials | No |
| GET | `/api/auth/me` | Get current user | Yes |

## Project Structure

```
backend/
├── src/
│   ├── index.ts                # Express app entry point
│   ├── lib/
│   │   └── prisma.ts           # Prisma client instance
│   ├── controllers/
│   │   └── authController.ts   # Auth business logic
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   └── validate.ts         # Zod request validation
│   ├── routes/
│   │   └── auth.route.ts       # Auth route definitions
│   ├── openapi/
│   │   ├── index.ts            # OpenAPI spec entry
│   │   ├── helpers.ts          # Schema conversion utils
│   │   └── paths/
│   │       └── auth.path.ts    # Auth endpoint docs
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

| Command | Description |
|---------|-------------|
| `bun i` | Install dependencies |
| `bun run start` | Start PostgreSQL container |
| `bun run reset` | Stop PostgreSQL container |
| `bun run setup` | Generate Prisma client + push schema to DB |
| `bun run dev` | Start dev server with hot reload |
| `bun run test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run build` | Build for production |
