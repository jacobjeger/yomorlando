"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TicketOptionRow } from "@/components/forms/ticket-option-row";
import type { ParkWithOptions } from "@/lib/database.types";
import type { UseFormReturn } from "react-hook-form";

interface SeaworldSectionProps {
  park: ParkWithOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function SeaworldSection({ park, form }: SeaworldSectionProps) {
  const selectedDates = (form.watch("seaworldDates") || []) as string[];

  return (
    <div className="space-y-4">
      {/* Date selector */}
      {park.event_date_ranges.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Select date(s)</Label>
          <div className="mt-2 space-y-2">
            {park.event_date_ranges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedDates.includes(range.range_start)}
                  onCheckedChange={(checked) => {
                    const current = selectedDates;
                    form.setValue(
                      "seaworldDates",
                      checked
                        ? [...current, range.range_start]
                        : current.filter((d: string) => d !== range.range_start)
                    );
                  }}
                />
                <Label className="font-normal cursor-pointer">
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Options */}
      <div className="space-y-3">
        {park.ticket_options.map((option) => (
          <TicketOptionRow key={option.id} option={option} form={form} />
        ))}
      </div>
    </div>
  );
}
