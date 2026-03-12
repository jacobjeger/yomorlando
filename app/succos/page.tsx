import { Ticket } from "lucide-react";
import { getLatestEventByHoliday } from "@/lib/queries/events";
import { SeasonHero } from "@/components/ui/season-hero";
import { ServiceCard } from "@/components/ui/service-card";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Succos",
  description: "Succos services in Orlando — discounted park tickets for Chol HaMoed.",
};

export const dynamic = "force-dynamic";

export default async function SuccosPage() {
  const event = await getLatestEventByHoliday("succos");

  const isOrderOpen = event
    ? new Date(event.order_open) <= new Date() &&
      new Date(event.order_close) > new Date()
    : false;

  return (
    <div>
      <SeasonHero title="Succos" event={event} />

      <section className="container py-12 md:py-16">
        {event && isOrderOpen && (
          <div className="mb-10 text-center">
            <CountdownTimer
              targetDate={event.order_close}
              label="Order deadline"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 rounded-full bg-[hsl(38,75%,55%)]" />
          <h2 className="text-2xl font-bold">Available Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="Park Tickets"
            description="Discounted tickets for Universal, SeaWorld, Disney, and more for your Chol HaMoed outings."
            icon={Ticket}
            href="/succos/tickets"
            disabled={!isOrderOpen}
            disabledText="Orders closed"
          />
        </div>

        <div className="mt-12 p-6 rounded-xl border bg-card">
          <h3 className="text-base font-semibold mb-3">Please Note</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
              All orders are subject to availability
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
              Park ticket orders are final — no refunds or exchanges
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
