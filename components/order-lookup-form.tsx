"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { OrderSummaryCard } from "@/components/order-summary-card";
import { lookupOrder } from "@/app/actions/order-lookup";
import { Loader2 } from "lucide-react";
import type { Order, OrderItem, KasheringDetails } from "@/lib/database.types";

export function OrderLookupForm() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    order: Order;
    items: OrderItem[];
    kasheringDetails: KasheringDetails | null;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !orderId.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await lookupOrder(email, orderId);
      if (!res.found) {
        setError(res.error);
      } else {
        setResult({
          order: res.order,
          items: res.items,
          kasheringDetails: res.kasheringDetails,
        });
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used for your order"
                required
              />
            </div>
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID"
                className="font-mono"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                "Look Up Order"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <OrderSummaryCard
          order={result.order}
          items={result.items}
          kasheringDetails={result.kasheringDetails}
        />
      )}
    </div>
  );
}
