"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

interface OrderTypeData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  revenueByDay: RevenueDataPoint[];
  ordersByType: OrderTypeData[];
}

const TYPE_COLORS: Record<string, string> = {
  Tickets: "#6366f1",
  Kashering: "#f59e0b",
  Lettuce: "#22c55e",
};

function formatDollars(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function DashboardCharts({ revenueByDay, ordersByType }: DashboardChartsProps) {
  const hasData = revenueByDay.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      {/* Revenue Over Time */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Revenue (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={formatDollars} />
                <Tooltip
                  formatter={(value) => [formatDollars(Number(value)), "Revenue"]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-16">No order data yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Orders by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Orders by Type</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersByType.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={ordersByType}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ordersByType.map((entry) => (
                    <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-16">No order data yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
