"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-sm text-muted-foreground min-w-fit">
          {label}
        </span>
      )}
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled || value <= min}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const num = parseInt(e.target.value) || 0;
            onChange(Math.min(max, Math.max(min, num)));
          }}
          className="h-8 w-14 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled || value >= max}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
