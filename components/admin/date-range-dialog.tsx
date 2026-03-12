"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { addDateRange, updateDateRange } from "@/app/actions/admin/events";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { EventDateRange } from "@/lib/database.types";

interface DateRangeDialogProps {
  parkId: string;
  dateRange?: EventDateRange;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DateRangeDialog({
  parkId,
  dateRange,
  open,
  onOpenChange,
}: DateRangeDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const isEditing = !!dateRange;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);

    const data = {
      label: fd.get("label") as string,
      range_start: fd.get("range_start") as string,
      range_end: fd.get("range_end") as string,
    };

    try {
      if (isEditing) {
        await updateDateRange(dateRange.id, data);
        toast({ title: "Date range updated" });
      } else {
        await addDateRange(parkId, data);
        toast({ title: "Date range created" });
      }
      onOpenChange(false);
      router.refresh();
    } catch {
      toast({ title: "Failed to save date range", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Date Range" : "Add Date Range"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the date range details." : "Add a new date range for this park."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} key={dateRange?.id || "new"} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              defaultValue={dateRange?.label ?? ""}
              required
              placeholder='e.g. Week 1 (Apr 1-8)'
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="range_start">Start Date</Label>
              <Input
                id="range_start"
                name="range_start"
                type="date"
                defaultValue={dateRange?.range_start ?? ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="range_end">End Date</Label>
              <Input
                id="range_end"
                name="range_end"
                type="date"
                defaultValue={dateRange?.range_end ?? ""}
                required
              />
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
                isEditing ? "Save Changes" : "Add Range"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
