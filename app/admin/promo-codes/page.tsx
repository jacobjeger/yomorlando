import { getAllPromoCodes } from "@/lib/queries/promo";
import { PromoCodesPanel } from "@/components/admin/promo-codes-panel";

export const dynamic = "force-dynamic";

export default async function AdminPromoCodesPage() {
  const codes = await getAllPromoCodes();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Promo Codes</h1>
      <PromoCodesPanel initialCodes={codes} />
    </div>
  );
}
