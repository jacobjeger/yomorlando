"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { addTicketOption, updateTicketOption } from "@/app/actions/admin/events";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { TicketOption } from "@/lib/database.types";

interface TicketOptionDialogProps {
  parkId: string;
  option?: TicketOption;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketOptionDialog({
  parkId,
  option,
  open,
  onOpenChange,
}: TicketOptionDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const isEditing = !!option;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);

    const data = {
      option_code: fd.get("option_code") as string,
      label: fd.get("label") as string,
      description: fd.get("description") as string,
      price_child: Math.round(parseFloat(fd.get("price_child") as string) * 100),
      price_adult: Math.round(parseFloat(fd.get("price_adult") as string) * 100),
      includes_epic: fd.get("includes_epic") === "on",
      child_age_min: parseInt(fd.get("child_age_min") as string) || 3,
      child_age_max: fd.get("child_age_max")
        ? parseInt(fd.get("child_age_max") as string)
        : null,
      adult_age_min: parseInt(fd.get("adult_age_min") as string) || 10,
      is_active: fd.get("is_active") !== "off",
      display_order: parseInt(fd.get("display_order") as string) || 0,
    };

    try {
      if (isEditing) {
        await updateTicketOption(option.id, data);
        toast({ title: "Ticket option updated" });
      } else {
        await addTicketOption(parkId, data);
        toast({ title: "Ticket option created" });
      }
      onOpenChange(false);
      router.refresh();
    } catch {
      toast({ title: "Failed to save ticket option", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Ticket Option" : "Add Ticket Option"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the ticket option details below." : "Fill in the details for the new ticket option."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} key={option?.id || "new"} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="option_code">Code</Label>
              <Input
                id="option_code"
                name="option_code"
                defaultValue={option?.option_code ?? ""}
                required
                maxLength={10}
                placeholder="e.g. U3PHE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                defaultValue={option?.display_order ?? 0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              defaultValue={option?.label ?? ""}
              required
              placeholder="e.g. 3-Day Park-to-Park + Epic Universe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={option?.description ?? ""}
              placeholder="Brief description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_child">Child Price ($)</Label>
              <Input
                id="price_child"
                name="price_child"
                type="number"
                step="0.01"
                min="0"
                defaultValue={option ? (option.price_child / 100).toFixed(2) : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_adult">Adult Price ($)</Label>
              <Input
                id="price_adult"
                name="price_adult"
                type="number"
                step="0.01"
                min="0"
                defaultValue={option ? (option.price_adult / 100).toFixed(2) : ""}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="child_age_min">Child Age Min</Label>
              <Input
                id="child_age_min"
                name="child_age_min"
                type="number"
                defaultValue={option?.child_age_min ?? 3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child_age_max">Child Age Max</Label>
              <Input
                id="child_age_max"
                name="child_age_max"
                type="number"
                defaultValue={option?.child_age_max ?? 9}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adult_age_min">Adult Age Min</Label>
              <Input
                id="adult_age_min"
                name="adult_age_min"
                type="number"
                defaultValue={option?.adult_age_min ?? 10}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="includes_epic"
                name="includes_epic"
                defaultChecked={option?.includes_epic ?? false}
              />
              <Label htmlFor="includes_epic">Includes Epic Universe</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={option?.is_active ?? true}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                isEditing ? "Save Changes" : "Add Option"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
