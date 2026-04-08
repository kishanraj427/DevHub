import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "gradient" | "ghost";
  isLoading?: boolean;
}

function Button({
  className,
  variant = "gradient",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-headline font-bold tracking-tight transition-all duration-300",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "gradient" && [
          "w-full bg-linear-to-r from-accent to-accent-secondary text-white",
          "py-4 rounded-xl text-lg tracking-tight",
          "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-[0.98]",
        ],
        variant === "ghost" && [
          "text-(--sea-ink-soft) hover:text-(--sea-ink) text-sm",
        ],
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export { Button };
