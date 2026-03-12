import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, Ticket, Utensils, Leaf } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import type { Event, HolidayType } from "@/lib/database.types";

const holidayLabels: Record<HolidayType, string> = {
  pesach: "Pesach",
  succos: "Succos",
  winter_break: "Winter Break",
};

const holidayColors: Record<HolidayType, string> = {
  pesach: "bg-blue-100 text-blue-800",
  succos: "bg-green-100 text-green-800",
  winter_break: "bg-purple-100 text-purple-800",
};

const seasonPaths: Record<HolidayType, string> = {
  pesach: "/pesach",
  succos: "/succos",
  winter_break: "/winter-break",
};

interface EventCardProps {
  event: Event;
  showCountdown?: boolean;
}

export function EventCard({ event, showCountdown = true }: EventCardProps) {
  const seasonPath = seasonPaths[event.holiday_type];
  const isOrderOpen =
    new Date(event.order_open) <= new Date() &&
    new Date(event.order_close) > new Date();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={holidayColors[event.holiday_type]}
          >
            {holidayLabels[event.holiday_type]}
          </Badge>
          <span className="text-sm text-muted-foreground">{event.year}</span>
        </div>
        <CardTitle className="mt-2">{event.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {format(new Date(event.start_date), "MMM d")} —{" "}
          {format(new Date(event.end_date), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="gap-1">
            <Ticket className="h-3 w-3" />
            Park Tickets
          </Badge>
          {event.holiday_type === "pesach" && (
            <>
              <Badge variant="outline" className="gap-1">
                <Utensils className="h-3 w-3" />
                Kashering
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Leaf className="h-3 w-3" />
                Lettuce
              </Badge>
            </>
          )}
        </div>

        {showCountdown && isOrderOpen && (
          <CountdownTimer
            targetDate={event.order_close}
            label="Order deadline"
          />
        )}
        {showCountdown && !isOrderOpen && new Date(event.order_close) > new Date() && (
          <p className="text-sm text-muted-foreground">
            Orders open {format(new Date(event.order_open), "MMM d, yyyy")}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={seasonPath}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
