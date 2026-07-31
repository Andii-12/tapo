import { type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  fullWidth,
  loading,
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 box-border border px-6 py-3 text-sm tracking-wide transition-all duration-300 disabled:opacity-50 min-h-[48px]";
  const styles =
    variant === "primary"
      ? "border-transparent bg-ink text-on-ink hover:opacity-90 hover:tracking-[0.08em]"
      : variant === "secondary"
        ? "border-ink bg-transparent text-ink hover:bg-ink hover:text-on-ink"
        : "border-transparent text-ink-muted hover:text-ink";

  return (
    <button
      className={`${base} ${styles} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Уншиж байна…" : children}
    </button>
  );
}
