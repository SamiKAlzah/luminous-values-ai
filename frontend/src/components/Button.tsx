import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "quiet";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-small font-bold " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-hover",
  quiet: "border border-line bg-brand-tint text-ink hover:border-brand",
};

/** Class string for links that should look like a Button. */
export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
