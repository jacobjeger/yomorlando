import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, Ticket, Utensils, Leaf, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import type { Event, HolidayType } from "@/lib/database.types";

const holidayLabels: Record<HolidayType, string> = {
  pesach: "Pesach",
  succos: "Succos",
  winter_break: "Winter Break",
};

const holidayColors: Record<HolidayType, string> = {
  pesach: "bg-amber-100 text-amber-800 border-amber-200",
  succos: "bg-emerald-100 text-emerald-800 border-emerald-200",
  winter_break: "bg-blue-100 text-blue-800 border-blue-200",
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
    <Link
      href={seasonPath}
      className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-[hsl(38,75%,55%,0.3)] transition-all duration-300"
    >
      <div className="h-1.5 bg-gradient-to-r from-[hsl(224,50%,28%)] to-[hsl(38,75%,55%)]" />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="secondary"
            className={`${holidayColors[event.holiday_type]} border text-xs font-medium`}
          >
            {holidayLabels[event.holiday_type]}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">{event.year}</span>
        </div>

        <h3 className="text-lg font-semibold mb-2">{event.name}</h3>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <CalendarDays className="h-3.5 w-3.5" />
          {format(new Date(event.start_date), "MMM d")} —{" "}
          {format(new Date(event.end_date), "MMM d, yyyy")}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
            <Ticket className="h-3 w-3" />
            Tickets
          </span>
          {event.holiday_type === "pesach" && (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                <Utensils className="h-3 w-3" />
                Kashering
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                <Leaf className="h-3 w-3" />
                Lettuce
              </span>
            </>
          )}
        </div>

        <div className="mt-auto">
          {showCountdown && isOrderOpen && (
            <div className="mb-3">
              <CountdownTimer
                targetDate={event.order_close}
                label="Order deadline"
              />
            </div>
          )}
          {showCountdown && !isOrderOpen && new Date(event.order_close) > new Date() && (
            <p className="text-xs text-muted-foreground mb-3">
              Orders open {format(new Date(event.order_open), "MMM d, yyyy")}
            </p>
          )}

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(224,50%,28%)] group-hover:text-[hsl(38,75%,45%)] transition-colors">
            View Details
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
