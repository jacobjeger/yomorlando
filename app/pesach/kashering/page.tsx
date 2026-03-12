import { getOpenEventForHoliday, getEventWithParks } from "@/lib/queries/events";
import { KasheringForm } from "@/components/forms/kashering-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villa Kashering",
  description: "Order professional villa kashering services for Pesach in Orlando.",
};

export const dynamic = "force-dynamic";

export default async function KasheringPage() {
  const event = await getOpenEventForHoliday("pesach");

  if (!event) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Villa Kashering</h1>
        <p className="text-lg text-muted-foreground">
          Orders are currently closed. Please check back when the Pesach
          ordering window opens.
        </p>
      </div>
    );
  }

  const eventWithParks = await getEventWithParks(event.id);

  // Get access day date ranges from event config (using any park's date ranges as general event dates)
  const accessDays: string[] = [];
  if (eventWithParks) {
    for (const park of eventWithParks.parks) {
      for (const range of park.event_date_ranges) {
        if (!accessDays.includes(range.label)) {
          accessDays.push(range.label);
        }
      }
    }
  }

  // If no date ranges configured, generate from event dates
  if (accessDays.length === 0) {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      accessDays.push(d.toISOString().split("T")[0]);
    }
  }

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-2">Villa Kashering</h1>
      <p className="text-muted-foreground mb-8">
        Professional kashering service for your Orlando villa — Pesach{" "}
        {event.year}
      </p>

      <KasheringForm eventId={event.id} accessDays={accessDays} />
    </div>
  );
}
