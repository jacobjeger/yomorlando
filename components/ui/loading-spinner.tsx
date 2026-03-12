import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

export function LoadingSpinner({ className, text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <Loader2 className={cn("h-8 w-8 animate-spin text-primary", className)} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
