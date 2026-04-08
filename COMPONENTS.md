# Component Catalogue

Reference this file before creating any new component. If a component exists here, reuse it.

---

## UI Primitives (`frontend/src/components/ui/`)

### `Button`

**File:** `src/components/ui/button.tsx`  
**Props:** `variant?: 'gradient' | 'ghost'`, `isLoading?: boolean`, all native `<button>` props  
**Usage:**

```tsx
import { Button } from '@/components/ui/button'
<Button variant="gradient" isLoading={isPending}>Submit</Button>
<Button variant="ghost">Cancel</Button>
```

### `Checkbox`

**File:** `src/components/ui/checkbox.tsx`  
**Props:** all `@radix-ui/react-checkbox` Root props  
**Usage:**

```tsx
import { Checkbox } from "@/components/ui/checkbox";
<Checkbox
  id="terms"
  onCheckedChange={(checked) => setValue("terms", checked === true)}
/>;
```

### `Dialog`

**File:** `src/components/ui/dialog.tsx`  
**Exports:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`  
**Usage:**

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Title</DialogTitle>
  </DialogContent>
</Dialog>;
```

### `DropdownMenu`

**File:** `src/components/ui/dropdown-menu.tsx`  
**Exports:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`  
**Usage:**

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => {}}>Action</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

### `Input`

**File:** `src/components/ui/input.tsx`  
**Props:** `error?: boolean`, all native `<input>` props  
**Usage:**

```tsx
import { Input } from "@/components/ui/input";
<Input
  type="email"
  placeholder="dev@hub.com"
  error={!!errors.email}
  {...register("email")}
/>;
```

### `Label`

**File:** `src/components/ui/label.tsx`  
**Props:** all `@radix-ui/react-label` Root props  
**Usage:**

```tsx
import { Label } from "@/components/ui/label";
<Label htmlFor="email">Email Address</Label>;
```

### `Tabs`

**File:** `src/components/ui/tabs.tsx`  
**Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`  
**Usage:**

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>;
```

### `Tooltip`

**File:** `src/components/ui/tooltip.tsx`  
**Exports:** `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`  
**Note:** `TooltipProvider` is already mounted at the root (`__root.tsx`). Do not add another one.  
**Usage:**

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
<Tooltip>
  <TooltipTrigger asChild>
    <button>Hover me</button>
  </TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>;
```

---

## Auth Components (`frontend/src/components/auth/`)

### `AuthLayout`

**File:** `src/components/auth/AuthLayout.tsx`  
**Props:** `variant: 'signup' | 'login'`, `children: React.ReactNode`  
**Description:** Shared shell for auth pages. Renders background blobs, `AuthHeader`, content slot, `AuthFooter`.  
**Usage:**

```tsx
import { AuthLayout } from "@/components/auth/AuthLayout";
<AuthLayout variant="signup">
  <SignUpForm />
</AuthLayout>;
```

### `AuthHeader`

**File:** `src/components/auth/AuthHeader.tsx`  
**Props:** `variant: 'signup' | 'login'`  
**Description:** Sticky auth page header with DevHub gradient logo and a contextual nav link.

### `AuthFooter`

**File:** `src/components/auth/AuthFooter.tsx`  
**Props:** none  
**Description:** Dark footer bar with logo, social/doc links, copyright.

### `LoginForm`

**File:** `src/components/auth/LoginForm.tsx`  
**Props:** none  
**Description:** Login glass card with email + password fields, API error banner, submit button. Uses `useLogin` hook internally.

### `PasswordStrengthBar`

**File:** `src/components/auth/PasswordStrengthBar.tsx`  
**Props:** `password: string`  
**Description:** Pure presentational. Computes strength score 0–4 and renders 4 colored segments + label.  
**Exported helper:** `computeStrength(password: string): number`  
**Usage:**

```tsx
import { PasswordStrengthBar } from "@/components/auth/PasswordStrengthBar";
<PasswordStrengthBar password={watchedPassword} />;
```

### `SignUpForm`

**File:** `src/components/auth/SignUpForm.tsx`  
**Props:** none  
**Description:** Sign up glass card with email, password + strength bar, confirm password, terms checkbox. Uses `useSignUp` hook internally.

---

## Layout Components (`frontend/src/components/layout/`)

### `Header`

**File:** `src/components/layout/Header.tsx`  
**Props:** none  
**Description:** Main app sticky header. Logo, nav links, social icons, ThemeToggle. Rendered by `_app.tsx` layout — do NOT import into auth pages.

### `Footer`

**File:** `src/components/layout/Footer.tsx`  
**Props:** none  
**Description:** Main app footer with social links. Rendered by `_app.tsx` layout.

### `ThemeToggle`

**File:** `src/components/layout/ThemeToggle.tsx`  
**Props:** none  
**Description:** Dropdown (DropdownMenu) to switch Light/Dark/System theme. Used inside `Header`.

---

## Hooks (`frontend/src/hooks/`)

### `useLogin`

**File:** `src/hooks/useLogin.ts`  
**Returns:** TanStack Query `UseMutationResult` for `POST /api/auth/login`  
**On success:** stores JWT in localStorage, navigates to `/`

### `useSignUp`

**File:** `src/hooks/useSignUp.ts`  
**Returns:** TanStack Query `UseMutationResult` for `POST /api/auth/signup`  
**On success:** stores JWT in localStorage, navigates to `/`

---

## Utilities (`frontend/src/lib/`)

### `cn`

**File:** `src/lib/utils.ts`  
**Usage:** `cn(...classNames)` — merges Tailwind classes with `clsx` + `tailwind-merge`

### Auth token helpers

**File:** `src/lib/auth.ts`  
**Exports:** `getToken(): string | null`, `setToken(token: string): void`, `clearToken(): void`  
**Storage:** `localStorage` key `devhub_token`
