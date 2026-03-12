import type { Metadata } from "next";
import { DonationPageForm } from "@/components/forms/donation-page-form";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Yeshiva of Miami's Yom Tov services in the Orlando villa resort area with a tax-deductible donation.",
};

export default function DonatePage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Support Our Mission
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Your donation helps us continue providing Yom Tov services to the frum
          community in the Orlando villa resort area.
        </p>
      </div>
      <DonationPageForm />
    </div>
  );
}
