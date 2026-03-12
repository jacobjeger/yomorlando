import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/lib/database.types";

interface SeasonHeroProps {
  title: string;
  event: Event | null;
}

export function SeasonHero({ title, event }: SeasonHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[hsl(224,50%,18%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38,75%,55%,0.12),transparent_60%)]" />
      <div className="container relative py-16 md:py-24 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h1>
        {event && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[hsl(38,75%,55%)] font-semibold text-lg">{event.year}</span>
            <p className="text-white/60 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(event.start_date), "MMMM d")} —{" "}
              {format(new Date(event.end_date), "MMMM d, yyyy")}
            </p>
          </div>
        )}
        {!event && (
          <p className="text-lg text-white/50">
            No upcoming event scheduled. Check back soon!
          </p>
        )}
      </div>
    </section>
  );
}
