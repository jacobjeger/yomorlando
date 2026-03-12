import { formatCents } from "@/lib/utils";

interface PriceDisplayProps {
  cents: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  cents,
  className = "",
  size = "md",
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl font-bold",
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {formatCents(cents)}
    </span>
  );
}
