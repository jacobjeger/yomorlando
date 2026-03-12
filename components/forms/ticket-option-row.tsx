"use client";

import { Badge } from "@/components/ui/badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { PriceDisplay } from "@/components/ui/price-display";
import type { TicketOption } from "@/lib/database.types";
import type { UseFormReturn } from "react-hook-form";

interface TicketOptionRowProps {
  option: TicketOption;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  disabled?: boolean;
  disabledReason?: string;
}

export function TicketOptionRow({
  option,
  form,
  disabled = false,
  disabledReason,
}: TicketOptionRowProps) {
  const key = `ticketSelections.${option.id}`;
  const childQty = form.watch(`${key}.childQty`) || 0;
  const adultQty = form.watch(`${key}.adultQty`) || 0;

  const childAgeLabel = option.child_age_max
    ? `Ages ${option.child_age_min}-${option.child_age_max}`
    : `Ages ${option.child_age_min}+`;

  const adultAgeLabel = `Ages ${option.adult_age_min}+`;

  return (
    <div
      className={`border rounded-lg p-4 space-y-3 ${
        disabled ? "opacity-50" : ""
      }`}
      title={disabled ? disabledReason : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono">
              {option.option_code}
            </Badge>
            <span className="font-medium">{option.label}</span>
            {option.includes_epic && (
              <Badge className="bg-purple-600 text-white text-xs">EPIC</Badge>
            )}
          </div>
          {option.description && (
            <p className="text-sm text-muted-foreground">{option.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {option.price_child > 0 && (
          <div className="flex items-center justify-between gap-2 bg-muted/30 rounded p-2">
            <div>
              <p className="text-sm font-medium">Child</p>
              <p className="text-xs text-muted-foreground">{childAgeLabel}</p>
              <PriceDisplay cents={option.price_child} size="sm" className="text-primary" />
            </div>
            <QuantityStepper
              value={childQty}
              onChange={(val) => {
                form.setValue(`${key}.optionId`, option.id);
                form.setValue(`${key}.childQty`, val);
              }}
              disabled={disabled}
            />
          </div>
        )}
        {option.price_adult > 0 && (
          <div className="flex items-center justify-between gap-2 bg-muted/30 rounded p-2">
            <div>
              <p className="text-sm font-medium">Adult</p>
              <p className="text-xs text-muted-foreground">{adultAgeLabel}</p>
              <PriceDisplay cents={option.price_adult} size="sm" className="text-primary" />
            </div>
            <QuantityStepper
              value={adultQty}
              onChange={(val) => {
                form.setValue(`${key}.optionId`, option.id);
                form.setValue(`${key}.adultQty`, val);
              }}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
