import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[hsl(224,50%,14%)] text-white/80">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[hsl(38,75%,55%)] flex items-center justify-center">
                <span className="text-sm font-bold text-[hsl(224,50%,18%)]">Y</span>
              </div>
              <span className="text-lg font-semibold text-white">YoM Orlando</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Yeshiva of Miami — providing Jewish holiday services in the
              Orlando, Florida villa resort area since 2019.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Seasons
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
