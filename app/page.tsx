import Link from "next/link";
import Image from "next/image";
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
  CalendarDays,
} from "lucide-react";

export const dynamic = "force-dynamic";

const seasons = [
  {
    title: "Pesach",
    href: "/pesach",
    icon: Sun,
    description: "Park tickets, villa kashering, and checked lettuce for your Yom Tov in Orlando.",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    title: "Succos",
    href: "/succos",
    icon: Leaf,
    description: "Discounted theme park tickets for Chol HaMoed Succos outings.",
    color: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    title: "Winter Break",
    href: "/winter-break",
    icon: Snowflake,
    description: "Theme park tickets for your family&apos;s winter getaway.",
    color: "from-blue-500/20 to-indigo-500/10",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
];

const features = [
  {
    icon: Ticket,
    title: "Discounted Tickets",
    description: "Save on Universal, Disney, SeaWorld, and more for your Yom Tov trip.",
  },
  {
    icon: Utensils,
    title: "Villa Kashering",
    description: "Have your Orlando villa kashered l'Pesach by our experienced team.",
  },
  {
    icon: Leaf,
    title: "Checked Lettuce",
    description: "Bodek-checked romaine lettuce for your Seder, delivered to your door.",
  },
  {
    icon: MapPin,
    title: "Local Pickup",
    description: "Convenient pickup in Solara, ChampionsGate, and nearby communities.",
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
          <Image
            src="/logo-large.png"
            alt="YoM — Yeshiva of Miami"
            width={280}
            height={138}
            className="h-24 md:h-32 w-auto mx-auto mb-8 brightness-0 invert"
            priority
          />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Yom Tov Services{" "}
            <span className="text-[hsl(38,75%,55%)]">in Orlando</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your one-stop source for discounted park tickets, villa kashering,
            checked lettuce, and more — serving the frum community in the
            Orlando villa resort area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pesach"
              className="inline-flex items-center justify-center gap-2 bg-[hsl(38,75%,55%)] text-[hsl(224,50%,14%)] font-semibold px-8 py-3.5 rounded-lg hover:bg-[hsl(38,75%,60%)] transition-colors"
            >
              Pesach Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#seasons"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-8 py-3.5 rounded-lg hover:bg-white/15 transition-colors"
            >
              Browse All Yamim Tovim
            </Link>
          </div>
        </div>
      </section>

      {/* Current Yom Tov - Featured */}
      {upcomingEvents.length > 0 && (() => {
        const featured = upcomingEvents[0];
        const isOrderOpen =
          new Date(featured.order_open) <= new Date() &&
          new Date(featured.order_close) > new Date();
        const seasonPath = featured.holiday_type === "pesach" ? "/pesach" : featured.holiday_type === "succos" ? "/succos" : "/winter-break";
        const holidayLabel = featured.holiday_type === "pesach" ? "Pesach" : featured.holiday_type === "succos" ? "Succos" : "Winter Break";

        return (
          <section className="bg-gradient-to-b from-[hsl(38,75%,55%,0.08)] to-transparent border-b">
            <div className="container py-10 md:py-14">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[hsl(38,75%,55%)]">
                  {isOrderOpen ? "Now Open" : "Coming Soon"} — {holidayLabel} {featured.year}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">{featured.name}</h2>
                  <p className="text-muted-foreground mb-1 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {format(new Date(featured.start_date), "MMMM d")} — {format(new Date(featured.end_date), "MMMM d, yyyy")}
                  </p>
                  {isOrderOpen && (
                    <p className="text-sm text-muted-foreground mb-6">
                      Orders close {format(new Date(featured.order_close), "MMMM d, yyyy")}
                    </p>
                  )}
                  {!isOrderOpen && new Date(featured.order_open) > new Date() && (
                    <p className="text-sm text-muted-foreground mb-6">
                      Orders open {format(new Date(featured.order_open), "MMMM d, yyyy")}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`${seasonPath}/tickets`}
                      className="inline-flex items-center gap-2 bg-[hsl(224,50%,28%)] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[hsl(224,50%,35%)] transition-colors"
                    >
                      <Ticket className="h-4 w-4" /> Park Tickets
                    </Link>
                    {featured.holiday_type === "pesach" && (
                      <>
                        <Link
                          href="/pesach/kashering"
                          className="inline-flex items-center gap-2 bg-white border-2 border-[hsl(224,50%,28%)] text-[hsl(224,50%,28%)] font-semibold px-6 py-3 rounded-lg hover:bg-[hsl(224,50%,28%,0.05)] transition-colors"
                        >
                          <Utensils className="h-4 w-4" /> Villa Kashering
                        </Link>
                        <Link
                          href="/pesach/lettuce"
                          className="inline-flex items-center gap-2 bg-white border-2 border-[hsl(224,50%,28%)] text-[hsl(224,50%,28%)] font-semibold px-6 py-3 rounded-lg hover:bg-[hsl(224,50%,28%,0.05)] transition-colors"
                        >
                          <Leaf className="h-4 w-4" /> Checked Lettuce
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <EventCard event={featured} showCountdown />
                </div>
              </div>
            </div>
          </section>
        );
      })()}

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

      {/* More Upcoming Events */}
      {upcomingEvents.length > 1 && (
        <section className="container py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full bg-[hsl(38,75%,55%)]" />
            <h2 className="text-2xl md:text-3xl font-bold">
              More Upcoming Yamim Tovim
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(1).map((event) => (
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
              Explore by Yom Tov
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We offer services for every Yom Tov season. Choose below to see
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
              Previous Yamim Tovim
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
