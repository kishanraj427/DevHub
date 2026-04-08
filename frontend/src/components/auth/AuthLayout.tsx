import { Box, Flex } from "@radix-ui/themes";
import { AuthHeader } from "./AuthHeader";
import { AuthFooter } from "./AuthFooter";

interface AuthLayoutProps {
  variant: "signup" | "login";
  children: React.ReactNode;
}

export function AuthLayout({ variant, children }: AuthLayoutProps) {
  return (
    <Flex
      direction="column"
      className="min-h-screen bg-(--bg-base) text-(--sea-ink)"
    >
      {/* Background blobs */}
      <Box className="fixed inset-0 overflow-hidden pointer-events-none">
        <Box className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[rgba(59,130,246,0.10)] blur-[120px]" />
        <Box className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[rgba(139,92,246,0.10)] blur-[120px]" />
      </Box>

      <AuthHeader variant={variant} />

      <Flex
        asChild
        align="center"
        justify="center"
        className="grow px-6 pt-32 pb-20"
      >
        <main>{children}</main>
      </Flex>

      <AuthFooter />
    </Flex>
  );
}
