import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <Card className={disabled ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {disabled ? (
          <Button disabled className="w-full">
            {disabledText}
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={href}>Order Now</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
