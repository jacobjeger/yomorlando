"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TicketOptionRow } from "@/components/forms/ticket-option-row";
import type { ParkWithOptions } from "@/lib/database.types";
import type { UseFormReturn } from "react-hook-form";

interface UniversalSectionProps {
  park: ParkWithOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

function isOptionDisabled(
  option: { date_restriction_start: string | null; date_restriction_end: string | null },
  selectedRangeStart: string | null,
  selectedRangeEnd: string | null
): boolean {
  if (!option.date_restriction_start || !option.date_restriction_end) return false;
  if (!selectedRangeStart || !selectedRangeEnd) return false;

  // Option is disabled if the selected range falls outside the option's date restriction window
  const optStart = new Date(option.date_restriction_start);
  const optEnd = new Date(option.date_restriction_end);
  const selStart = new Date(selectedRangeStart);
  const selEnd = new Date(selectedRangeEnd);

  // Disabled if selected range doesn't overlap with option's date restriction
  return selEnd < optStart || selStart > optEnd;
}

export function UniversalSection({ park, form }: UniversalSectionProps) {
  const selectedDateRangeId = form.watch("universalDateRange") || "";

  const selectedRange = park.event_date_ranges.find(
    (r) => r.id === selectedDateRangeId
  );

  return (
    <div className="space-y-4">
      {/* Date Range Selector */}
      {park.event_date_ranges.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Select your dates</Label>
          <RadioGroup
            value={selectedDateRangeId}
            onValueChange={(val) => form.setValue("universalDateRange", val)}
            className="mt-2 space-y-2"
          >
            {park.event_date_ranges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <RadioGroupItem value={range.id} id={`ur-${range.id}`} />
                <Label htmlFor={`ur-${range.id}`} className="font-normal cursor-pointer">
                  {range.label} ({range.range_start} — {range.range_end})
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Ticket Options */}
      <div className="space-y-3">
        {park.ticket_options.map((option) => {
          const disabled = isOptionDisabled(
            option,
            selectedRange?.range_start ?? null,
            selectedRange?.range_end ?? null
          );
          return (
            <TicketOptionRow
              key={option.id}
              option={option}
              form={form}
              disabled={disabled}
              disabledReason={
                disabled
                  ? "This option is not available for your selected dates"
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
