"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TicketOptionRow } from "@/components/forms/ticket-option-row";
import type { ParkWithOptions } from "@/lib/database.types";
import type { UseFormReturn } from "react-hook-form";

interface DisneySectionProps {
  park: ParkWithOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function DisneySection({ park, form }: DisneySectionProps) {
  const disneyFirstDay = form.watch("disneyFirstDay") || "";

  // Calculate valid date windows from event_date_ranges
  const validWindows = park.event_date_ranges.map((r) => ({
    start: r.range_start,
    end: r.range_end,
  }));

  // Min and max dates for the date picker
  const minDate = validWindows.length > 0
    ? validWindows.reduce((min, w) => (w.start < min ? w.start : min), validWindows[0].start)
    : "";
  const maxDate = validWindows.length > 0
    ? validWindows.reduce((max, w) => (w.end > max ? w.end : max), validWindows[0].end)
    : "";

  return (
    <div className="space-y-4">
      {/* First Day of Visit */}
      <div>
        <Label className="text-sm font-medium">First day of visit</Label>
        <Input
          type="date"
          value={disneyFirstDay}
          onChange={(e) => form.setValue("disneyFirstDay", e.target.value)}
          min={minDate}
          max={maxDate}
          className="mt-2 max-w-xs"
        />
        {validWindows.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Valid dates: {validWindows.map((w) => `${w.start} to ${w.end}`).join(", ")}
          </p>
        )}
      </div>

      {/* Ticket Options */}
      <div className="space-y-3">
        {park.ticket_options.map((option) => (
          <TicketOptionRow key={option.id} option={option} form={form} />
        ))}
      </div>
    </div>
  );
}
