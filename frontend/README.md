# DevHub Frontend

A dark-first code snippet sharing platform built with TanStack Start (React SSR), TanStack Router, Radix UI, and Tailwind CSS v4.

---

## Getting Started

```bash
# From repo root
bun install
cd frontend
bun run dev
```

## Build for Production

```bash
bun run build
```

## Testing

Uses [Vitest](https://vitest.dev/) with `jsdom` for component tests.

```bash
# Run all frontend tests
bun run test

# Run a specific test file
bun run test tests/auth.test.ts
```

---

## Routing Architecture

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing.

### Route Tree

```
src/routes/
  __root.tsx          ← HTML shell (no layout chrome — just Theme + TooltipProvider)
  _app.tsx            ← Pathless layout: adds Header + Footer (main app pages only)
  _app/
    index.tsx         ← Home page  →  /
  signup.tsx          ← Sign up page  →  /signup
  login.tsx           ← Login page   →  /login
```

### Layout System

There are **two separate layout layers**:

| Layer       | File             | What it adds                                   | Who sees it                        |
| ----------- | ---------------- | ---------------------------------------------- | ---------------------------------- |
| Root shell  | `__root.tsx`     | HTML document, Theme provider, TooltipProvider | Every page                         |
| App layout  | `_app.tsx`       | `<Header>` + `<Footer>`                        | Main app pages (`/`, future pages) |
| Auth layout | `AuthLayout.tsx` | Background blobs, `AuthHeader`, `AuthFooter`   | `/signup`, `/login`                |

**Key principle:** Auth pages use their own `AuthLayout` — they do **not** go through `_app.tsx`, so they never show the main `Header`/`Footer`.

To add a new **main app page** (with header/footer), create it under `src/routes/_app/`:

```
src/routes/_app/dashboard.tsx   →  /dashboard
```

To add a new **auth-style page** (no header/footer), create it at the top level:

```
src/routes/reset-password.tsx   →  /reset-password
```

---

## Auth Flow

### How signup works

1. User fills in `SignUpForm` (`src/components/auth/SignUpForm.tsx`)
2. Form validates with React Hook Form + Zod (`signupInputSchema` from shared schemas)
3. On submit → `useSignUp` hook calls `POST /api/auth/signup` via the generated client
4. On success → JWT stored in `localStorage` via `setToken()` → redirect to `/`
5. On API error → error shown in red banner above submit button

### How login works

Same flow through `LoginForm` + `useLogin` → `POST /api/auth/login`.

### Token storage

```ts
// src/lib/auth.ts
getToken(); // → string | null from localStorage
setToken(t); // → stores under key 'devhub_token'
clearToken(); // → removes token (use on logout)
```

The token is read directly from localStorage when building API request headers. No React context or global store in this iteration.

### API client

Generated from the backend OpenAPI spec at `src/generated/client/backend/sdk.gen.ts`. Import API functions directly:

```ts
import { signup, login, getSnippets } from "@/generated/client/backend";
```

To regenerate after backend changes:

```bash
# From repo root
bun run openapi
```

---

## Component Structure

See `COMPONENTS.md` at the repo root for the full catalogue. Summary:

```
src/components/
  ui/           ← Reusable primitives (Button, Input, Label, Checkbox, Dialog, DropdownMenu, Tabs, Tooltip)
  auth/         ← Auth-specific (AuthLayout, AuthHeader, AuthFooter, SignUpForm, LoginForm, PasswordStrengthBar)
  layout/       ← Main app chrome (Header, Footer, ThemeToggle)

src/hooks/
  useSignUp.ts  ← TanStack Query mutation for signup
  useLogin.ts   ← TanStack Query mutation for login

src/lib/
  auth.ts       ← localStorage token helpers
  utils.ts      ← cn() class merging helper
```

---

## Styling

Uses [Tailwind CSS v4](https://tailwindcss.com/) with CSS custom properties for theming.

**Dark-first:** `:root` = dark values. `[data-theme="light"]` = light overrides.

**Tailwind v4 CSS variable syntax:**

```tsx
// Correct (v4)
className = "text-(--sea-ink) bg-(--chip-bg)";

// Wrong (v3 style — do not use)
className = "text-[var(--sea-ink)]";
```

Key CSS variables (defined in `src/styles.css`):

| Variable             | Value                | Use                       |
| -------------------- | -------------------- | ------------------------- |
| `--bg-base`          | `#0b1120`            | Page background           |
| `--sea-ink`          | `#f1f5f9`            | Body text                 |
| `--sea-ink-soft`     | `#94a3b8`            | Muted text                |
| `--lagoon`           | `#3b82f6`            | Primary accent (blue)     |
| `--palm`             | `#8b5cf6`            | Secondary accent (violet) |
| `--accent`           | `#3b82f6`            | Tailwind gradient start   |
| `--accent-secondary` | `#8b5cf6`            | Tailwind gradient end     |
| `--chip-bg`          | `rgba(30,41,59,0.9)` | Input / chip background   |
| `--line`             | `#334155`            | Borders                   |

---

## Linting & Formatting

```bash
bun run lint     # Biome check
bun run format   # Biome + Prettier
```

Biome config is at the repo root (`/biome.json`). CSS files are excluded from Biome and handled by Prettier only.
