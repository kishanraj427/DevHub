import { Link } from "@tanstack/react-router";
import { Box, Flex, Text } from "@radix-ui/themes";

interface AuthHeaderProps {
  variant: "signup" | "login";
}

export function AuthHeader({ variant }: AuthHeaderProps) {
  return (
    <Box
      asChild
      className="fixed top-0 w-full z-50 bg-(--bg-base)/60 backdrop-blur-xl border-b border-(--line)/20 shadow-[0_32px_64px_rgba(221,226,248,0.04)]"
    >
      <header>
        <Flex
          justify="between"
          align="center"
          className="max-w-7xl mx-auto px-8 h-20"
        >
          <Text
            size="5"
            weight="bold"
            className="tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-accent to-accent-secondary font-headline font-bold text-3xl"
          >
            DevHub
          </Text>
          <Box>
            {variant === "signup" ? (
              <Link
                to="/login"
                className="font-headline text-xl tracking-tight text-(--sea-ink-soft) hover:text-(--sea-ink) transition-all duration-300 no-underline"
              >
                Log in →
              </Link>
            ) : (
              <Link
                to="/signup"
                className="font-headline text-xl tracking-tight text-(--sea-ink-soft) hover:text-(--sea-ink) transition-all duration-300 no-underline"
              >
                Sign up →
              </Link>
            )}
          </Box>
        </Flex>
      </header>
    </Box>
  );
}
