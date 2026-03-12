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
import { formatCents } from "@/lib/utils";
import { Download } from "lucide-react";
import { OrderFilters } from "@/components/admin/order-filters";
import type { Order } from "@/lib/database.types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = createServiceClient();

  const page = parseInt(searchParams.page || "1");
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (searchParams.order_type) {
    query = query.eq("order_type", searchParams.order_type);
  }
  if (searchParams.status) {
    query = query.eq("fulfillment_status", searchParams.status);
  }
  if (searchParams.search) {
    const term = searchParams.search.replace(/%/g, "");
    query = query.or(
      `customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`
    );
  }

  const { data, count } = await query.range(from, to);
  const orders = (data ?? []) as Order[];
  const totalCount = count ?? 0;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    fulfilled: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    picked_up: "bg-purple-100 text-purple-800",
  };

  const exportParams = new URLSearchParams();
  if (searchParams.order_type) exportParams.set("order_type", searchParams.order_type);
  if (searchParams.status) exportParams.set("status", searchParams.status);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button asChild variant="outline">
          <a href={`/api/admin/orders/export?${exportParams.toString()}`}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </a>
        </Button>
      </div>

      <OrderFilters totalCount={totalCount} pageSize={PAGE_SIZE} />

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
