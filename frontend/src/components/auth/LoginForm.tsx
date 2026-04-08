import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginInputSchema } from "@devhub/shared-schemas/schemas/";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useLogin";

const loginSchema = loginInputSchema;
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutateAsync, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await mutateAsync({ email: data.email, password: data.password });
    } catch (error: unknown) {
      const apiError = error as { error?: string };
      setError("root", {
        message: apiError?.error ?? "Invalid email or password.",
      });
    }
  };

  return (
    <Box className="w-full max-w-lg">
      <Box className="relative overflow-hidden rounded-xl border border-(--line)/15 bg-(--surface-strong) p-8 shadow-[0_32px_64px_rgba(221,226,248,0.04)] backdrop-blur-sm md:p-12">
        {/* Top gradient stripe */}
        <Box className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-accent to-accent-secondary" />

        {/* Heading */}
        <Box className="mb-10 text-center">
          <Text
            as="p"
            size="8"
            weight="bold"
            className="font-headline tracking-tight text-(--sea-ink) mb-3"
          >
            Welcome back
          </Text>
          <Text as="p" size="2" className="text-(--sea-ink-soft)">
            Sign in to your DevHub account.
          </Text>
        </Box>

        {/* Root error banner */}
        {errors.root && (
          <Box className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <Text size="2" className="text-red-400">
              {errors.root.message}
            </Text>
          </Box>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Email */}
          <Box>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="dev@hub.com"
              error={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <Text as="p" size="1" className="mt-1.5 text-red-400">
                {errors.email.message}
              </Text>
            )}
          </Box>

          {/* Password */}
          <Box>
            <Flex justify="between" align="center" className="mb-2">
              <Label htmlFor="password" className="mb-0">
                Password
              </Label>
              <span className="text-xs text-(--sea-ink-soft) cursor-default select-none">
                Forgot password?
              </span>
            </Flex>
            <Box className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={!!errors.password}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--sea-ink-soft) hover:text-(--sea-ink) transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Box>
            {errors.password && (
              <Text as="p" size="1" className="mt-1.5 text-red-400">
                {errors.password.message}
              </Text>
            )}
          </Box>

          <Button type="submit" isLoading={isPending}>
            Sign in
          </Button>
        </form>

        {/* Footer link */}
        <Box className="mt-8 border-t border-(--line)/10 pt-8 text-center">
          <Text size="2" className="text-(--sea-ink-soft)">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="ml-1 font-medium text-(--lagoon) hover:text-(--palm) transition-colors no-underline"
            >
              Sign up
            </a>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
