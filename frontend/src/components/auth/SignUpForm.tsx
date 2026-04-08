import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Terminal, Share2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signupInputSchema } from "@devhub/shared-schemas/schemas/";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@/hooks/useSignUp";
import { PasswordStrengthBar } from "./PasswordStrengthBar";

const signUpSchema = signupInputSchema
  .extend({
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { mutateAsync, isPending } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { terms: false },
  });

  const password = watch("password", "");

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await mutateAsync({ email: data.email, password: data.password });
    } catch (error: unknown) {
      const apiError = error as { error?: string };
      setError("root", {
        message: apiError?.error ?? "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Box className="w-full max-w-lg">
      {/* Form card */}
      <Box className="relative overflow-hidden rounded-xl border border-(--line)/15 bg-(--surface-strong) p-8 shadow-[0_32px_64px_rgba(221,226,248,0.04)] backdrop-blur-sm md:p-12">
        {/* Top gradient stripe */}
        <Box className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-accent to-accent-secondary" />

        {/* Heading */}
        <Box className="mb-10 text-center">
          <Text
            as="p"
            size="8"
            weight="bold"
            className="font-headline tracking-tight text-(--sea-ink) mb-3 text-xl font-semibold"
          >
            Join the hub
          </Text>
          <Text as="p" size="2" className="text-(--sea-ink-soft) text-sm">
            Craft your developer identity and start sharing code as art.
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
            <Label htmlFor="password">Password</Label>
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
            <PasswordStrengthBar password={password} />
            {errors.password && (
              <Text as="p" size="1" className="mt-1.5 text-red-400">
                {errors.password.message}
              </Text>
            )}
          </Box>

          {/* Confirm password */}
          <Box>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Box className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                error={!!errors.confirmPassword}
                className="pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--sea-ink-soft) hover:text-(--sea-ink) transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Box>
            {errors.confirmPassword && (
              <Text as="p" size="1" className="mt-1.5 text-red-400">
                {errors.confirmPassword.message}
              </Text>
            )}
          </Box>

          {/* Terms */}
          <Flex align="start" gap="3" className="py-2">
            <Checkbox
              id="terms"
              onCheckedChange={(checked) =>
                setValue("terms", checked === true, { shouldValidate: true })
              }
            />
            <Box>
              <label
                htmlFor="terms"
                className="text-sm text-(--sea-ink-soft) leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-(--lagoon) hover:text-(--palm) transition-colors underline underline-offset-4 decoration-(--lagoon)/30"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-(--lagoon) hover:text-(--palm) transition-colors underline underline-offset-4 decoration-(--lagoon)/30"
                >
                  Privacy Policy
                </a>
                .
              </label>
              {errors.terms && (
                <Text as="p" size="1" className="mt-1 text-red-400">
                  {errors.terms.message}
                </Text>
              )}
            </Box>
          </Flex>

          <Button type="submit" isLoading={isPending}>
            Create account
          </Button>
        </form>

        {/* Footer link */}
        <Box className="mt-8 border-t border-(--line)/10 pt-8 text-center">
          <Text size="2" className="text-(--sea-ink-soft)">
            Already part of the community?{" "}
            <a
              href="/login"
              className="ml-1 font-medium text-(--lagoon) hover:text-(--palm) transition-colors no-underline"
            >
              Log in here
            </a>
          </Text>
        </Box>
      </Box>

      {/* Feature cards */}
      <Flex gap="4" className="mt-12 grid grid-cols-2">
        <Box className="rounded-xl border border-(--line)/5 bg-(--surface)/50 p-4">
          <Flex align="center" gap="3" className="mb-1">
            <Terminal size={20} className="text-(--palm)" />
            <Text
              size="1"
              className="font-sans uppercase tracking-widest text-(--sea-ink-soft)"
            >
              Environment
            </Text>
          </Flex>
          <Text size="1" className="text-(--sea-ink-soft)">
            Cloud-native dev workflow integrated by default.
          </Text>
        </Box>
        <Box className="rounded-xl border border-(--line)/5 bg-(--surface)/50 p-4">
          <Flex align="center" gap="3" className="mb-1">
            <Share2 size={20} className="text-(--lagoon)" />
            <Text
              size="1"
              className="font-sans uppercase tracking-widest text-(--sea-ink-soft)"
            >
              Sharing
            </Text>
          </Flex>
          <Text size="1" className="text-(--sea-ink-soft)">
            Instant deployment of your code snippets.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
