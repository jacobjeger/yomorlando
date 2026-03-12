"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import type { DeliveryOption } from "@/lib/settings-defaults";

interface DeliveryOptionsEditorProps {
  options: DeliveryOption[];
  onChange: (options: DeliveryOption[]) => void;
}

export function DeliveryOptionsEditor({ options, onChange }: DeliveryOptionsEditorProps) {
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newFee, setNewFee] = useState("");

  const addOption = () => {
    const trimmedValue = newValue.trim();
    const trimmedLabel = newLabel.trim();
    if (!trimmedValue || !trimmedLabel) return;
    if (options.some((o) => o.value === trimmedValue)) return;

    onChange([
      ...options,
      {
        value: trimmedValue,
        label: trimmedLabel,
        fee: Math.round(parseFloat(newFee || "0") * 100),
      },
    ]);
    setNewValue("");
    setNewLabel("");
    setNewFee("");
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: keyof DeliveryOption, val: string) => {
    const updated = [...options];
    if (field === "fee") {
      updated[index] = { ...updated[index], fee: Math.round(parseFloat(val || "0") * 100) };
    } else {
      updated[index] = { ...updated[index], [field]: val };
    }
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {options.map((opt, index) => (
        <div
          key={`${opt.value}-${index}`}
          className="grid grid-cols-[1fr_2fr_auto_auto] gap-2 items-end bg-muted/50 rounded-md p-3"
        >
          <div>
            <Label className="text-xs text-muted-foreground">Value</Label>
            <Input
              value={opt.value}
              onChange={(e) => updateOption(index, "value", e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Label</Label>
            <Input
              value={opt.label}
              onChange={(e) => updateOption(index, "label", e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Fee ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={(opt.fee / 100).toFixed(2)}
              onChange={(e) => updateOption(index, "fee", e.target.value)}
              className="h-8 text-sm w-24"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => removeOption(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}

      <div className="grid grid-cols-[1fr_2fr_auto_auto] gap-2 items-end border-2 border-dashed rounded-md p-3">
        <div>
          <Label className="text-xs text-muted-foreground">Value</Label>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="e.g. ship_express"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Label</Label>
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Express Shipping ($50)"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Fee ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            placeholder="0.00"
            className="h-8 text-sm w-24"
          />
        </div>
        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={addOption}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
