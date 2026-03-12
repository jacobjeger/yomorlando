import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { OrderDetail } from "@/components/admin/order-detail";
import type { Order, OrderItem, KasheringDetails } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", params.id);

  const { data: kasheringDetails } = await supabase
    .from("kashering_details")
    .select("*")
    .eq("order_id", params.id)
    .single();

  return (
    <OrderDetail
      order={order as Order}
      items={(items ?? []) as OrderItem[]}
      kasheringDetails={(kasheringDetails as KasheringDetails) || null}
    />
  );
}
