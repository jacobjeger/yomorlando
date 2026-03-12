import Link from "next/link";
import { getUpcomingEvents, getPastEvents } from "@/lib/queries/events";
import { EventCard } from "@/components/ui/event-card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Ticket,
  Utensils,
  Leaf,
  MapPin,
  Sun,
  Snowflake,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const seasons = [
  {
    title: "Pesach",
    href: "/pesach",
    icon: Sun,
    description: "Park tickets, villa kashering, and checked lettuce for your Pesach vacation.",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    title: "Succos",
    href: "/succos",
    icon: Leaf,
    description: "Discounted theme park tickets for Chol HaMoed Succos.",
    color: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    title: "Winter Break",
    href: "/winter-break",
    icon: Snowflake,
    description: "Theme park tickets for your family winter vacation.",
    color: "from-blue-500/20 to-indigo-500/10",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
];

const features = [
  {
    icon: Ticket,
    title: "Discounted Tickets",
    description: "Save on Universal, Disney, SeaWorld, and more.",
  },
  {
    icon: Utensils,
    title: "Villa Kashering",
    description: "Professional kashering for your Orlando vacation home.",
  },
  {
    icon: Leaf,
    title: "Checked Lettuce",
    description: "Pre-checked romaine lettuce delivered for your Seder.",
  },
  {
    icon: MapPin,
    title: "Local Pickup",
    description: "Convenient pickup locations in Orlando resort communities.",
  },
];

export default async function HomePage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[hsl(224,50%,18%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38,75%,55%,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(224,50%,40%,0.2),transparent_60%)]" />
        <div className="container relative py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-white/80 mb-8">
            <MapPin className="h-3.5 w-3.5 text-[hsl(38,75%,55%)]" />
            Orlando, Florida
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Jewish Holiday Services{" "}
            <span className="text-[hsl(38,75%,55%)]">in Orlando</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your year-round destination for discounted park tickets, villa kashering,
            checked lettuce, and more — brought to you by Yeshiva of Miami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pesach"
              className="inline-flex items-center justify-center gap-2 bg-[hsl(38,75%,55%)] text-[hsl(224,50%,14%)] font-semibold px-8 py-3.5 rounded-lg hover:bg-[hsl(38,75%,60%)] transition-colors"
            >
              View Pesach Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#seasons"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-8 py-3.5 rounded-lg hover:bg-white/15 transition-colors"
            >
              Browse All Seasons
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-5 rounded-xl border bg-card"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[hsl(38,75%,55%,0.12)] flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-[hsl(38,75%,55%)]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="container py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full bg-[hsl(38,75%,55%)]" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Current & Upcoming Events
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} showCountdown />
            ))}
          </div>
        </section>
      )}

      {/* Seasons */}
      <section id="seasons" className="py-16 md:py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Explore by Season
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We offer services throughout the year. Choose a season to see
              what&apos;s available.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {seasons.map((season) => (
              <Link
                key={season.title}
                href={season.href}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg hover:border-[hsl(38,75%,55%,0.3)] transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${season.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${season.iconBg} flex items-center justify-center mb-4`}>
                    <season.icon className={`h-6 w-6 ${season.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{season.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {season.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(224,50%,28%)] group-hover:text-[hsl(38,75%,45%)] transition-colors">
                    View details
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="container py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full bg-muted-foreground/30" />
            <h2 className="text-xl font-semibold text-muted-foreground">
              Past Events
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium text-sm">{event.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.start_date), "MMM d")} —{" "}
                    {format(new Date(event.end_date), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">Completed</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
