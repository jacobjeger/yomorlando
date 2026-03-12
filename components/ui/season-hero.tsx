import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/lib/database.types";

interface SeasonHeroProps {
  title: string;
  event: Event | null;
}

export function SeasonHero({ title, event }: SeasonHeroProps) {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          {title}
        </h1>
        {event && (
          <>
            <p className="text-xl text-muted-foreground mb-2">{event.year}</p>
            <p className="text-base text-muted-foreground flex items-center justify-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(event.start_date), "MMMM d")} —{" "}
              {format(new Date(event.end_date), "MMMM d, yyyy")}
            </p>
          </>
        )}
        {!event && (
          <p className="text-lg text-muted-foreground">
            No upcoming event scheduled. Check back soon!
          </p>
        )}
      </div>
    </section>
  );
}
