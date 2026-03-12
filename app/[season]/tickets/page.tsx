import { notFound } from "next/navigation";
import { getOpenEventForHoliday, getEventWithParks } from "@/lib/queries/events";
import { TicketsForm } from "@/components/forms/tickets-form";
import type { HolidayType } from "@/lib/database.types";
import type { Metadata } from "next";

const seasonMap: Record<string, { holiday: HolidayType; label: string }> = {
  pesach: { holiday: "pesach", label: "Pesach" },
  succos: { holiday: "succos", label: "Succos" },
  "winter-break": { holiday: "winter_break", label: "Winter Break" },
};

export async function generateMetadata({
  params,
}: {
  params: { season: string };
}): Promise<Metadata> {
  const seasonInfo = seasonMap[params.season];
  if (!seasonInfo) return { title: "Not Found" };
  return {
    title: `${seasonInfo.label} Park Tickets`,
    description: `Order discounted park tickets for ${seasonInfo.label} in Orlando.`,
  };
}

export const dynamic = "force-dynamic";

export default async function TicketsPage({
  params,
}: {
  params: { season: string };
}) {
  const seasonInfo = seasonMap[params.season];
  if (!seasonInfo) notFound();

  const event = await getOpenEventForHoliday(seasonInfo.holiday);

  if (!event) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {seasonInfo.label} Park Tickets
        </h1>
        <p className="text-lg text-muted-foreground">
          Orders are currently closed. Please check back when the{" "}
          {seasonInfo.label} ordering window opens.
        </p>
      </div>
    );
  }

  const eventWithParks = await getEventWithParks(event.id);

  if (!eventWithParks) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {seasonInfo.label} Park Tickets
        </h1>
        <p className="text-lg text-muted-foreground">
          No ticket options are currently configured.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-2">
        {seasonInfo.label} Park Tickets
      </h1>
      <p className="text-muted-foreground mb-8">
        Discounted theme park tickets — {seasonInfo.label} {event.year}
      </p>

      <TicketsForm event={eventWithParks} />
    </div>
  );
}
