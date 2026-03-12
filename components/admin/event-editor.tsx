"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateEvent,
  togglePublished,
  duplicateEvent,
  addPark,
  addTicketOption,
  addDateRange,
  addPickupLocation,
  updateLettuceInventory,
} from "@/app/actions/admin/events";
import { useToast } from "@/hooks/use-toast";
import { Copy, Plus, Loader2 } from "lucide-react";
import type {
  Event,
  Park,
  TicketOption,
  EventDateRange,
  PickupLocation,
  LettuceInventory,
} from "@/lib/database.types";

interface EventEditorProps {
  event: Event;
  parks: Park[];
  ticketOptions: TicketOption[];
  dateRanges: EventDateRange[];
  pickupLocations: PickupLocation[];
  lettuceInventory: LettuceInventory | null;
}

export function EventEditor({
  event,
  parks,
  ticketOptions,
  dateRanges,
  pickupLocations,
  lettuceInventory,
}: EventEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      await updateEvent(event.id, {
        name: fd.get("name") as string,
        year: parseInt(fd.get("year") as string),
        start_date: fd.get("start_date") as string,
        end_date: fd.get("end_date") as string,
        order_open: fd.get("order_open") as string,
        order_close: fd.get("order_close") as string,
      });
      toast({ title: "Event saved" });
      router.refresh();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async () => {
    await togglePublished(event.id, !event.is_published);
    router.refresh();
  };

  const handleDuplicate = async () => {
    const newEvent = await duplicateEvent(event.id);
    router.push(`/admin/events/${newEvent.id}`);
  };

  const handleAddPark = async (parkName: string) => {
    await addPark(event.id, parkName);
    router.refresh();
  };

  const handleAddOption = async (parkId: string) => {
    await addTicketOption(parkId, {
      option_code: "NEW",
      label: "New Option",
      description: "",
      price_child: 0,
      price_adult: 0,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
    });
    router.refresh();
  };

  const handleAddDateRange = async (parkId: string) => {
    await addDateRange(parkId, {
      label: "New Range",
      range_start: event.start_date,
      range_end: event.end_date,
    });
    router.refresh();
  };

  const handleAddPickup = async () => {
    await addPickupLocation(event.id, {
      name: "New Location",
      address: "",
      notes: "",
    });
    router.refresh();
  };

  const handleUpdateLettuce = async (maxBags: number) => {
    await updateLettuceInventory(event.id, maxBags);
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <Badge variant={event.is_published ? "default" : "secondary"}>
            {event.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" /> Duplicate
          </Button>
          <div className="flex items-center gap-2">
            <Label htmlFor="published">Published</Label>
            <Switch
              id="published"
              checked={event.is_published}
              onCheckedChange={handleTogglePublished}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="parks">Parks & Tickets</TabsTrigger>
          <TabsTrigger value="pickup">Pickup Locations</TabsTrigger>
          <TabsTrigger value="lettuce">Lettuce Config</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={event.name} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input name="year" type="number" defaultValue={event.year} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input name="start_date" type="date" defaultValue={event.start_date} required />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input name="end_date" type="date" defaultValue={event.end_date} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Orders Open</Label>
                    <Input name="order_open" type="datetime-local" defaultValue={event.order_open.slice(0, 16)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Orders Close</Label>
                    <Input name="order_close" type="datetime-local" defaultValue={event.order_close.slice(0, 16)} required />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parks Tab */}
        <TabsContent value="parks">
          <div className="space-y-6">
            <div className="flex gap-2">
              <Select onValueChange={handleAddPark}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add park..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="universal">Universal</SelectItem>
                  <SelectItem value="seaworld">SeaWorld</SelectItem>
                  <SelectItem value="disney">Disney</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {parks.map((park) => {
              const parkOptions = ticketOptions.filter((o) => o.park_id === park.id);
              const parkDateRanges = dateRanges.filter((r) => r.park_id === park.id);

              return (
                <Card key={park.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{park.park_name}</span>
                      <Badge variant={park.is_active ? "default" : "secondary"}>
                        {park.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Date Ranges */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Date Ranges</h4>
                      {parkDateRanges.map((range) => (
                        <div key={range.id} className="text-sm p-2 bg-muted/30 rounded mb-1">
                          {range.label}: {range.range_start} — {range.range_end}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddDateRange(park.id)}
                        className="mt-2"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Date Range
                      </Button>
                    </div>

                    {/* Ticket Options */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Ticket Options</h4>
                      {parkOptions.map((option) => (
                        <div key={option.id} className="text-sm p-2 bg-muted/30 rounded mb-1 flex justify-between">
                          <span>
                            [{option.option_code}] {option.label}
                            {option.includes_epic && " (EPIC)"}
                          </span>
                          <span>
                            Child: ${(option.price_child / 100).toFixed(2)} | Adult: ${(option.price_adult / 100).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddOption(park.id)}
                        className="mt-2"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Option
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Pickup Locations Tab */}
        <TabsContent value="pickup">
          <Card>
            <CardHeader><CardTitle>Pickup Locations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {pickupLocations.map((loc) => (
                <div key={loc.id} className="p-3 bg-muted/30 rounded">
                  <p className="font-medium">{loc.name}</p>
                  {loc.address && <p className="text-sm text-muted-foreground">{loc.address}</p>}
                  {loc.notes && <p className="text-sm text-muted-foreground">{loc.notes}</p>}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddPickup}>
                <Plus className="h-4 w-4 mr-2" /> Add Location
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lettuce Tab */}
        <TabsContent value="lettuce">
          <Card>
            <CardHeader><CardTitle>Lettuce Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Maximum Bags</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    defaultValue={lettuceInventory?.max_bags ?? 0}
                    id="maxBags"
                    min={0}
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById("maxBags") as HTMLInputElement;
                      handleUpdateLettuce(parseInt(input.value) || 0);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
              {lettuceInventory && (
                <p className="text-sm text-muted-foreground">
                  Waitlist: {lettuceInventory.is_waitlist_active ? "Active" : "Inactive"}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
