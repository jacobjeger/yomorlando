import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[hsl(224,50%,14%)] text-white/80">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="YoM Orlando — Yeshiva of Miami"
                width={140}
                height={69}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Yeshiva of Miami — serving the frum community with Yom Tov
              services in the Orlando, Florida villa resort area.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Yamim Tovim
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pesach" className="text-white/60 hover:text-[hsl(38,75%,55%)] transition-colors">
                  Pesach
                </Link>
              </li>
              <li>
                <Link href="/succos" className="text-white/60 hover:text-[hsl(38,75%,55%)] transition-colors">
                  Succos
                </Link>
              </li>
              <li>
                <Link href="/winter-break" className="text-white/60 hover:text-[hsl(38,75%,55%)] transition-colors">
                  Winter Break
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/60 hover:text-[hsl(38,75%,55%)] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="mailto:info@yomorlando.com"
                  className="hover:text-[hsl(38,75%,55%)] transition-colors"
                >
                  info@yomorlando.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+13054000723"
                  className="hover:text-[hsl(38,75%,55%)] transition-colors"
                >
                  (305) 400-0723
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} Yeshiva of Miami. All rights reserved.</p>
          <Link
            href="/donate"
            className="text-[hsl(38,75%,55%)] font-medium hover:text-[hsl(38,75%,65%)] transition-colors"
          >
            Make a Donation
          </Link>
        </div>
      </div>
    </footer>
  );
}
