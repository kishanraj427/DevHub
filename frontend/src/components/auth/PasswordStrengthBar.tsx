import { Box, Flex, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

export function computeStrength(password: string): number {
  if (password.length < 1) return 0;
  let score = 1;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) score++;
  return score;
}

const scoreConfig: Record<
  number,
  { label: string; color: string; filledColor: string }
> = {
  0: {
    label: "",
    color: "text-(--sea-ink-soft)",
    filledColor: "bg-(--chip-bg)",
  },
  1: { label: "Weak", color: "text-red-400", filledColor: "bg-red-400" },
  2: { label: "Fair", color: "text-amber-400", filledColor: "bg-amber-400" },
  3: { label: "Good", color: "text-(--palm)", filledColor: "bg-(--palm)" },
  4: { label: "Strong", color: "text-green-400", filledColor: "bg-green-400" },
};

interface PasswordStrengthBarProps {
  password: string;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const score = computeStrength(password);
  const { label, color, filledColor } = scoreConfig[score];

  return (
    <Box className="mt-3 space-y-2">
      <Flex gap="1" className="h-1">
        {[1, 2, 3, 4].map((segment) => (
          <Box
            key={segment}
            className={cn(
              "flex-1 rounded-full h-full transition-colors duration-300",
              segment <= score ? filledColor : "bg-(--chip-bg)",
            )}
          />
        ))}
      </Flex>
      {password.length > 0 && (
        <Flex align="center" gap="1">
          <Text
            size="1"
            className={cn("font-sans uppercase tracking-wider", color)}
          >
            {label}
          </Text>
        </Flex>
      )}
    </Box>
  );
}
