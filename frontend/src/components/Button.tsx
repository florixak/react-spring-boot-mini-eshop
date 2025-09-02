import type { ButtonHTMLAttributes } from "react";
import { Button as ShadcnButton } from "./ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  isActive?: boolean;
  variant?: "default" | "outline" | "ghost";
}

const Button = ({
  onClick,
  loading,
  isActive,
  children,
  variant,
  className,
}: ButtonProps) => {
  return (
    <ShadcnButton
      variant={variant || "outline"}
      onClick={onClick}
      disabled={loading}
      className={cn(
        "px-6 py-5 rounded-lg border-secondary-200",
        isActive ? "bg-primary text-white" : "bg-transparent text-primary",
        className
      )}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
