import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCents } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";
import type { Order, OrderItem, KasheringDetails } from "@/lib/database.types";

interface OrderSummaryCardProps {
  order: Order;
  items: OrderItem[];
  kasheringDetails?: KasheringDetails | null;
  showSuccessHeader?: boolean;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
  picked_up: "Picked Up",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  fulfilled: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  picked_up: "bg-purple-100 text-purple-800",
};

export function OrderSummaryCard({ order, items, kasheringDetails, showSuccessHeader = false }: OrderSummaryCardProps) {
  return (
    <div className="space-y-6">
      {showSuccessHeader && (
        <div className="text-center space-y-2">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. A confirmation email has been sent to {order.customer_email}.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Details</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{order.order_type}</Badge>
              <Badge className={statusColors[order.fulfillment_status] || ""}>
                {statusLabels[order.fulfillment_status] || order.fulfillment_status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Order ID</p>
              <p className="font-mono text-xs">{order.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p>{format(new Date(order.created_at), "MMM d, yyyy h:mm a")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Name</p>
              <p>{order.customer_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{order.customer_email}</p>
            </div>
          </div>

          {kasheringDetails && (
            <>
              <Separator />
              <div className="space-y-1 text-sm">
                <p><strong>Development:</strong> {kasheringDetails.development}</p>
                <p><strong>Access Day:</strong> {kasheringDetails.access_day}</p>
                <p><strong>Houses:</strong> {kasheringDetails.num_houses} &middot; <strong>Bedrooms:</strong> {kasheringDetails.num_bedrooms}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Items</h3>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p>{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} @ {formatCents(item.unit_price)}
                    {item.age_category && ` (${item.age_category})`}
                    {item.visit_date && ` — ${item.visit_date}`}
                  </p>
                </div>
                <p className="font-medium">{formatCents(item.subtotal)}</p>
              </div>
            ))}
          </div>

          <Separator />

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
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCents(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatCents(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
