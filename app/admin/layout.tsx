import Link from "next/link";
import { CalendarDays, ShoppingCart, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const adminNav = [
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-muted/30 p-4">
        <h2 className="text-lg font-bold mb-4">Admin</h2>
        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <nav className="flex justify-around py-2">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
    </div>
  );
}
