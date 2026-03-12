import { getPublishedFaqItems } from "@/lib/queries/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about YoM Orlando services.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const items = await getPublishedFaqItems();

  return (
    <div className="container max-w-3xl py-12 md:py-16">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Find answers to common questions about our Yom Tov services in Orlando.
      </p>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No FAQ items available at this time.
        </p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
