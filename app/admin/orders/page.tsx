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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { formatCents } from "@/lib/utils";
import { Download } from "lucide-react";
import type { Order } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = createServiceClient();

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchParams.order_type) {
    query = query.eq("order_type", searchParams.order_type);
  }
  if (searchParams.status) {
    query = query.eq("fulfillment_status", searchParams.status);
  }

  const { data } = await query.limit(100);
  const orders = (data ?? []) as Order[];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    fulfilled: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    picked_up: "bg-purple-100 text-purple-800",
  };

  const currentParams = new URLSearchParams();
  if (searchParams.order_type) currentParams.set("order_type", searchParams.order_type);
  if (searchParams.status) currentParams.set("status", searchParams.status);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button asChild variant="outline">
          <a href={`/api/admin/orders/export?${currentParams.toString()}`}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </a>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <form className="flex gap-4">
          <Select name="order_type" defaultValue={searchParams.order_type || "all"}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Order Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tickets">Tickets</SelectItem>
              <SelectItem value="kashering">Kashering</SelectItem>
              <SelectItem value="lettuce">Lettuce</SelectItem>
            </SelectContent>
          </Select>
          <Select name="status" defaultValue={searchParams.status || "all"}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.customer_name}</TableCell>
                  <TableCell className="text-sm">{order.customer_email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {order.order_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCents(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.fulfillment_status] || ""}>
                      {order.fulfillment_status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
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
