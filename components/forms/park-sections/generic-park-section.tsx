"use client";

import { TicketOptionRow } from "@/components/forms/ticket-option-row";
import type { ParkWithOptions } from "@/lib/database.types";
import type { UseFormReturn } from "react-hook-form";

interface GenericParkSectionProps {
  park: ParkWithOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function GenericParkSection({ park, form }: GenericParkSectionProps) {
  return (
    <div className="space-y-3">
      {park.ticket_options.map((option) => (
        <TicketOptionRow key={option.id} option={option} form={form} />
      ))}
    </div>
  );
}
