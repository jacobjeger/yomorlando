import { Ticket } from "lucide-react";
import { getLatestEventByHoliday } from "@/lib/queries/events";
import { SeasonHero } from "@/components/ui/season-hero";
import { ServiceCard } from "@/components/ui/service-card";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Succos",
  description: "Succos services in Orlando — discounted park tickets.",
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
          <div className="mb-8 text-center">
            <CountdownTimer
              targetDate={event.order_close}
              label="Order deadline"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Available Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="Park Tickets"
            description="Discounted tickets for Universal, SeaWorld, Disney, and more."
            icon={Ticket}
            href="/succos/tickets"
            disabled={!isOrderOpen}
            disabledText="Orders closed"
          />
        </div>

        <div className="mt-12 p-6 rounded-lg border bg-muted/30">
          <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>All orders are subject to availability</li>
            <li>Park ticket orders are final — no refunds or exchanges</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
