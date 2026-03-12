import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import type { Event } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const supabase = createServiceClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("year", { ascending: false });

  const typedEvents = (events ?? []) as Event[];

  const holidayLabels: Record<string, string> = {
    pesach: "Pesach",
    succos: "Succos",
    winter_break: "Winter Break",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Holiday</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Order Window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {typedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No events yet. Create your first event.
                </TableCell>
              </TableRow>
            ) : (
              typedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{holidayLabels[event.holiday_type] || event.holiday_type}</TableCell>
                  <TableCell>{event.year}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(event.start_date), "MMM d")} —{" "}
                    {format(new Date(event.end_date), "MMM d")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(event.order_open), "MMM d")} —{" "}
                    {format(new Date(event.order_close), "MMM d")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.is_published ? "default" : "secondary"}>
                      {event.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/events/${event.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
