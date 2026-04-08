import { Box, Flex, Link, Text } from "@radix-ui/themes";

const footerLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Twitter", href: "https://x.com" },
  { label: "Discord", href: "#" },
  { label: "Documentation", href: "#" },
];

export function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <Box asChild className="w-full py-12 bg-[#080e1d] mt-auto">
      <footer>
        <Flex
          direction={{ initial: "column", sm: "row" }}
          justify="between"
          align="center"
          className="max-w-7xl mx-auto px-8 gap-6"
        >
          <Text
            size="4"
            weight="bold"
            className="text-slate-100 font-headline tracking-tight"
          >
            DevHub
          </Text>

          <Flex wrap="wrap" justify="center" gap="8">
            {footerLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                className="font-sans text-xs uppercase tracking-widest text-slate-500 hover:text-accent transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </Flex>

          <Text
            size="1"
            className="font-sans uppercase tracking-widest text-slate-500"
          >
            © {year} DevHub. Code as Art.
          </Text>
        </Flex>
      </footer>
    </Box>
  );
}
