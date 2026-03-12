import { getOpenEventForHoliday } from "@/lib/queries/events";
import { getLettuceInventory, getBagsOrdered } from "@/lib/queries/lettuce";
import { LettuceForm } from "@/components/forms/lettuce-form";
import { LettuceWaitlistForm } from "@/components/forms/lettuce-waitlist-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checked Lettuce",
  description: "Order pre-checked romaine lettuce for Pesach in Orlando.",
};

export const dynamic = "force-dynamic";

export default async function LettucePage() {
  const event = await getOpenEventForHoliday("pesach");

  if (!event) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Checked Lettuce</h1>
        <p className="text-lg text-muted-foreground">
          Orders are currently closed. Please check back when the Pesach
          ordering window opens.
        </p>
      </div>
    );
  }

  const inventory = await getLettuceInventory(event.id);
  const bagsOrdered = await getBagsOrdered(event.id);

  const isSoldOut = inventory ? bagsOrdered >= inventory.max_bags : false;
  const showWaitlist = isSoldOut && (inventory?.is_waitlist_active ?? false);

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-2">Checked Lettuce</h1>
      <p className="text-muted-foreground mb-8">
        Pre-checked romaine lettuce bags — Pesach {event.year}
      </p>

      {showWaitlist ? (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 font-medium">
              All bags have been sold out. Join the waitlist to be notified if
              more become available.
            </p>
          </div>
          <LettuceWaitlistForm eventId={event.id} />
        </div>
      ) : isSoldOut ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            All lettuce bags have been sold out for this season.
          </p>
        </div>
      ) : (
        <LettuceForm eventId={event.id} />
      )}
    </div>
  );
}
