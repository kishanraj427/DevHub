import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "block text-xs font-sans uppercase tracking-widest text-(--sea-ink-soft) mb-2 cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
