import { getOpenEventForHoliday } from "@/lib/queries/events";
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

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-2">Villa Kashering</h1>
      <p className="text-muted-foreground mb-8">
        Professional kashering service for your Orlando villa — Pesach{" "}
        {event.year}
      </p>

      <KasheringForm
        eventId={event.id}
        eventStartDate={event.start_date}
        eventEndDate={event.end_date}
      />
    </div>
  );
}
