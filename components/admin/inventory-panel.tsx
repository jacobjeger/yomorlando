"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleWaitlist, sendWaitlistBlast } from "@/app/actions/admin/inventory";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";
import type { Event, LettuceInventory, LettuceWaitlist } from "@/lib/database.types";
import { format } from "date-fns";

interface InventoryPanelProps {
  event: Event;
  inventory: LettuceInventory | null;
  bagsOrdered: number;
  waitlist: LettuceWaitlist[];
}

export function InventoryPanel({
  event,
  inventory,
  bagsOrdered,
  waitlist,
}: InventoryPanelProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const maxBags = inventory?.max_bags ?? 0;
  const remaining = Math.max(0, maxBags - bagsOrdered);
  const percentUsed = maxBags > 0 ? (bagsOrdered / maxBags) * 100 : 0;

  const handleToggleWaitlist = async () => {
    if (!inventory) return;
    await toggleWaitlist(event.id, !inventory.is_waitlist_active);
    router.refresh();
  };

  const handleSendBlast = async () => {
    setSending(true);
    try {
      await sendWaitlistBlast(event.id);
      toast({ title: "Emails sent to all waitlist entries" });
    } catch {
      toast({ title: "Failed to send emails", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{event.name}</span>
          <Badge>{event.year}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inventory Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold">{maxBags}</p>
            <p className="text-sm text-muted-foreground">Max Bags</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold">{bagsOrdered}</p>
            <p className="text-sm text-muted-foreground">Ordered</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold">{remaining}</p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              percentUsed >= 100
                ? "bg-red-500"
                : percentUsed >= 75
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>

        {/* Waitlist Toggle */}
        {inventory && (
          <div className="flex items-center gap-4">
            <Label>Waitlist Active</Label>
            <Switch
              checked={inventory.is_waitlist_active}
              onCheckedChange={handleToggleWaitlist}
            />
          </div>
        )}

        {/* Waitlist Table */}
        {waitlist.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Waitlist ({waitlist.length} entries)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendBlast}
                disabled={sending}
              >
                {sending ? (
                  <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Sending...</>
                ) : (
                  <><Mail className="mr-2 h-3 w-3" /> Send Email Blast</>
                )}
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Bags</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{entry.phone}</TableCell>
                    <TableCell>{entry.bags_requested}</TableCell>
                    <TableCell>
                      {format(new Date(entry.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
