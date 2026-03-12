import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCents } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { ShoppingCart, DollarSign, Ticket, Salad, ChefHat, Clock } from "lucide-react";
import type { Order } from "@/lib/database.types";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();

  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

  const [
    { count: totalOrders },
    { data: allOrders },
    { data: recentOrders },
    { count: pendingCount },
    { data: last30DaysOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("order_type, total"),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("fulfillment_status", "pending"),
    supabase
      .from("orders")
      .select("created_at, total")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true }),
  ]);

  const orders = (allOrders ?? []) as { order_type: string; total: number }[];
  const recent = (recentOrders ?? []) as Order[];

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const ticketCount = orders.filter((o) => o.order_type === "tickets").length;
  const kasheringCount = orders.filter((o) => o.order_type === "kashering").length;
  const lettuceCount = orders.filter((o) => o.order_type === "lettuce").length;

  // Aggregate revenue by day for chart
  const revenueMap = new Map<string, number>();
  for (const o of (last30DaysOrders ?? []) as { created_at: string; total: number }[]) {
    const day = format(new Date(o.created_at), "MMM d");
    revenueMap.set(day, (revenueMap.get(day) ?? 0) + o.total);
  }
  const revenueByDay = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  const ordersByType = [
    { name: "Tickets", value: ticketCount },
    { name: "Kashering", value: kasheringCount },
    { name: "Lettuce", value: lettuceCount },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    fulfilled: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    picked_up: "bg-purple-100 text-purple-800",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Link href="/admin/orders">
          <Card className="hover:border-primary/30 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalOrders ?? 0}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders?status=pending">
          <Card className="hover:border-primary/30 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount ?? 0}</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCents(totalRevenue)}</p>
          </CardContent>
        </Card>

        <Link href="/admin/orders?type=tickets">
          <Card className="hover:border-primary/30 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Orders
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{ticketCount}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders?type=kashering">
          <Card className="hover:border-primary/30 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kashering Orders
              </CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kasheringCount}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders?type=lettuce">
          <Card className="hover:border-primary/30 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lettuce Orders
              </CardTitle>
              <Salad className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{lettuceCount}</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts */}
      <DashboardCharts revenueByDay={revenueByDay} ordersByType={ordersByType} />

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        {order.customer_name}
                      </Link>
                    </TableCell>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
