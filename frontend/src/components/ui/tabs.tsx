import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "#/lib/utils";

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium",
        "text-[var(--sea-ink-soft)] outline-none transition-all",
        "hover:text-[var(--sea-ink)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-40",
        "data-[state=active]:bg-[var(--surface-strong)] data-[state=active]:text-[var(--sea-ink)] data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-3 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-1",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
