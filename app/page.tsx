import { getUpcomingEvents, getPastEvents } from "@/lib/queries/events";
import { EventCard } from "@/components/ui/event-card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            YoM Orlando
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Yeshiva of Miami
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your year-round destination for Jewish holiday services in the
            Orlando, Florida villa resort area. Park tickets, villa kashering,
            checked lettuce, and more.
          </p>
        </div>
      </section>

      {/* Current / Upcoming Events */}
      <section className="container py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Current & Upcoming Events
        </h2>

        {upcomingEvents.length === 0 ? (
          <p className="text-muted-foreground">
            No upcoming events at this time. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} showCountdown />
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="container py-12 md:py-16 border-t">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
              >
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.start_date), "MMM d")} —{" "}
                    {format(new Date(event.end_date), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
