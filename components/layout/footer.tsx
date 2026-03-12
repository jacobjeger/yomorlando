import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">YoM Orlando</h3>
            <p className="text-sm text-muted-foreground">
              Yeshiva of Miami — providing Jewish holiday services in the
              Orlando, Florida villa resort area.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/pesach"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pesach
                </Link>
              </li>
              <li>
                <Link
                  href="/succos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Succos
                </Link>
              </li>
              <li>
                <Link
                  href="/winter-break"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Winter Break
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                Email:{" "}
                <a
                  href="mailto:info@yomorlando.com"
                  className="hover:text-primary transition-colors"
                >
                  info@yomorlando.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Yeshiva of Miami. All rights reserved.</p>
          <Link
            href="/donate"
            className="text-primary font-medium hover:underline"
          >
            Make a Donation
          </Link>
        </div>
      </div>
    </footer>
  );
}
