"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEvent } from "@/app/actions/admin/events";
import { Loader2 } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const event = await createEvent({
        name: formData.get("name") as string,
        holiday_type: formData.get("holiday_type") as string,
        year: parseInt(formData.get("year") as string),
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string,
        order_open: formData.get("order_open") as string,
        order_close: formData.get("order_close") as string,
      });
      router.push(`/admin/events/${event.id}`);
    } catch {
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" name="name" required placeholder="e.g. Pesach 2026" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="holiday_type">Holiday</Label>
                <Select name="holiday_type" required>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pesach">Pesach</SelectItem>
                    <SelectItem value="succos">Succos</SelectItem>
                    <SelectItem value="winter_break">Winter Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" type="number" required defaultValue={new Date().getFullYear()} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" name="start_date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" name="end_date" type="date" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order_open">Orders Open</Label>
                <Input id="order_open" name="order_open" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_close">Orders Close</Label>
                <Input id="order_close" name="order_close" type="datetime-local" required />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
