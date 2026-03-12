"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCents } from "@/lib/utils";
import { format } from "date-fns";
import { Mail } from "lucide-react";
import { updateOrderStatus, refundOrder, deleteOrder, resendConfirmationEmail } from "@/app/actions/admin/orders";
import { useToast } from "@/hooks/use-toast";
import type { Order, OrderItem, KasheringDetails, FulfillmentStatus } from "@/lib/database.types";

interface OrderDetailProps {
  order: Order;
  items: OrderItem[];
  kasheringDetails: KasheringDetails | null;
}

export function OrderDetail({ order, items, kasheringDetails }: OrderDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [refunding, setRefunding] = useState(false);
  const [resending, setResending] = useState(false);

  const handleStatusChange = async (status: string) => {
    await updateOrderStatus(order.id, status as FulfillmentStatus);
    toast({ title: "Status updated" });
    router.refresh();
  };

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this order?")) return;
    setRefunding(true);
    try {
      await refundOrder(order.id);
      toast({ title: "Refund processed" });
      router.refresh();
    } catch {
      toast({ title: "Refund failed", variant: "destructive" });
    } finally {
      setRefunding(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await resendConfirmationEmail(order.id);
      toast({ title: "Confirmation email resent" });
    } catch {
      toast({ title: "Failed to resend email", variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(order.id);
      toast({ title: "Order deleted" });
      router.push("/admin/orders");
    } catch {
      toast({ title: "Failed to delete order", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Badge className="capitalize">{order.order_type}</Badge>
      </div>

      <div className="grid gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Email:</strong> {order.customer_email}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            {order.customer_address && typeof order.customer_address === "object" && (
              <p><strong>Address:</strong>{" "}
                {(order.customer_address as unknown as Record<string, string>).line1},{" "}
                {(order.customer_address as unknown as Record<string, string>).city},{" "}
                {(order.customer_address as unknown as Record<string, string>).state}{" "}
                {(order.customer_address as unknown as Record<string, string>).zip}
              </p>
            )}
            <p><strong>Date:</strong> {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}</p>
            {(() => {
              const deliveryItem = items.find((i) => i.delivery_method);
              return deliveryItem?.delivery_method ? (
                <p><strong>Delivery:</strong> {deliveryItem.delivery_method.replace("_", " ")}</p>
              ) : null;
            })()}
            {order.how_heard && <p><strong>How heard:</strong> {order.how_heard}</p>}
            {order.comments && <p><strong>Comments:</strong> {order.comments}</p>}
          </CardContent>
        </Card>

        {/* Kashering Details */}
        {kasheringDetails && (
          <Card>
            <CardHeader><CardTitle>Kashering Details</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Development:</strong> {kasheringDetails.development}</p>
              <p><strong>Access Day:</strong> {kasheringDetails.access_day}</p>
              <p><strong>Bedrooms:</strong> {kasheringDetails.num_bedrooms}</p>
              <p><strong>Houses:</strong> {kasheringDetails.num_houses}</p>
              <p><strong>Shul Membership:</strong> {kasheringDetails.shul_membership ? "Yes" : "No"}</p>
            </CardContent>
          </Card>
        )}

        {/* Order Items */}
        <Card>
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} @ {formatCents(item.unit_price)}
                    {item.age_category && ` (${item.age_category})`}
                    {item.visit_date && ` — ${item.visit_date}`}
                  </p>
                </div>
                <p className="font-medium">{formatCents(item.subtotal)}</p>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCents(order.subtotal)}</span>
              </div>
              {order.donation > 0 && (
                <div className="flex justify-between">
                  <span>Donation</span>
                  <span>{formatCents(order.donation)}</span>
                </div>
              )}
              {order.surcharge > 0 && (
                <div className="flex justify-between">
                  <span>Surcharge</span>
                  <span>{formatCents(order.surcharge)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatCents(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Status */}
        <Card>
          <CardHeader><CardTitle>Payment & Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Stripe ID:</strong> {order.stripe_payment_intent_id || "N/A"}</p>
            <div className="flex items-center gap-4">
              <strong>Status:</strong>
              <Select
                defaultValue={order.fulfillment_status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={resending}
              >
                <Mail className="mr-2 h-4 w-4" />
                {resending ? "Sending..." : "Resend Email"}
              </Button>
              {order.stripe_payment_intent_id && (
                <Button
                  variant="destructive"
                  onClick={handleRefund}
                  disabled={refunding}
                >
                  {refunding ? "Processing Refund..." : "Issue Refund"}
                </Button>
              )}
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                Delete Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
