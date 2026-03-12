import { getAllFaqItems } from "@/lib/queries/faq";
import { FaqPanel } from "@/components/admin/faq-panel";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const items = await getAllFaqItems();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">FAQ Management</h1>
      <FaqPanel initialItems={items} />
    </div>
  );
}
