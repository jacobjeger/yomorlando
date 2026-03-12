"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { addPickupLocation, updatePickupLocation } from "@/app/actions/admin/events";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { PickupLocation } from "@/lib/database.types";

interface PickupLocationDialogProps {
  eventId: string;
  location?: PickupLocation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PickupLocationDialog({
  eventId,
  location,
  open,
  onOpenChange,
}: PickupLocationDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const isEditing = !!location;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);

    const data = {
      name: fd.get("name") as string,
      address: fd.get("address") as string,
      notes: fd.get("notes") as string,
    };

    try {
      if (isEditing) {
        await updatePickupLocation(location.id, data);
        toast({ title: "Pickup location updated" });
      } else {
        await addPickupLocation(eventId, data);
        toast({ title: "Pickup location created" });
      }
      onOpenChange(false);
      router.refresh();
    } catch {
      toast({ title: "Failed to save pickup location", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Pickup Location" : "Add Pickup Location"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the pickup location details." : "Add a new pickup location for this event."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} key={location?.id || "new"} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={location?.name ?? ""}
              required
              placeholder="e.g. Solara Resort"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={location?.address ?? ""}
              placeholder="Full address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={location?.notes ?? ""}
              placeholder="Pickup instructions, hours, etc."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                isEditing ? "Save Changes" : "Add Location"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
