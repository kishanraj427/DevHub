import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full bg-(--chip-bg) border border-(--line) rounded-xl px-4 py-3",
        "text-(--sea-ink) placeholder:text-(--sea-ink-soft)",
        "focus:outline-none focus:ring-1 focus:ring-(--lagoon)/60",
        "transition-all duration-300",
        error && "ring-1 ring-red-500/60 border-red-500/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
