import Link from "next/link";
import { type LucideIcon, ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
  disabledText?: string;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  disabled = false,
  disabledText = "Coming soon",
}: ServiceCardProps) {
  if (disabled) {
    return (
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 opacity-50">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        <span className="inline-flex items-center text-sm font-medium text-muted-foreground">
          {disabledText}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg hover:border-[hsl(38,75%,55%,0.3)] transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(38,75%,55%,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-[hsl(38,75%,55%,0.12)] flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-[hsl(38,75%,55%)]" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(224,50%,28%)] group-hover:text-[hsl(38,75%,45%)] transition-colors">
          Order Now
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
