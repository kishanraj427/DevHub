import { Box, Flex, Link, Text } from '@radix-ui/themes'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const XIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" width="20" height="20" fill="currentColor">
    <path d="M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" width="20" height="20" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

const socialLinks = [
  { href: 'https://x.com', label: 'Follow on X', icon: <XIcon /> },
  { href: 'https://github.com', label: 'View on GitHub', icon: <GitHubIcon /> },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box
      asChild
      className="mt-20 border-t border-(--line) bg-[color-mix(in_oklab,var(--header-bg)_84%,transparent_16%)] px-4 pb-14 pt-10 text-(--sea-ink-soft)"
    >
      <footer>
        <Flex
          direction={{ initial: 'column', sm: 'row' }}
          align="center"
          justify="between"
          gap="4"
          className="mx-auto w-full max-w-[min(1080px,calc(100%-2rem))] text-center sm:text-left"
        >
          <Text size="2" className="text-(--sea-ink-soft)">
            &copy; {year} DevHub. All rights reserved.
          </Text>
          <Text
            size="1"
            weight="bold"
            className="uppercase tracking-[0.16em] text-(--kicker)"
          >
            Built with TanStack Start
          </Text>
        </Flex>

        <Flex justify="center" gap="2" mt="4">
          {socialLinks.map(({ href, label, icon }) => (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  target="_blank"
                  className="rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
                >
                  <Text as="span" className="sr-only">{label}</Text>
                  {icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </Flex>
      </footer>
    </Box>
  )
}
