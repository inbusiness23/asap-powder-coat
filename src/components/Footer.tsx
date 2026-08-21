import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { COMPANY, SAFE_FINISH_COPY } from "@/lib/copy";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-[#222a33] px-2.5 py-1.5 text-sm font-black leading-none text-brand-lime">
                ASAP
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {COMPANY.wordmark}
                </div>
                <div className="text-[10px] text-zinc-500">{COMPANY.name}</div>
              </div>
            </div>
            <p className="text-sm font-medium text-white">{COMPANY.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Custom powder-coat and color-finish for gates, frames, and
              hardware. This site is not FDT, not a dealer portal, not Tonneau,
              and not a Facebook ads account.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              Licensed GC #{COMPANY.license}. Coating is fulfilled by a vendor.
              ASAP does not operate a powder plant.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Color finish
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Handles", href: "/handles" },
                { name: "Hinges", href: "/hinges" },
                { name: "Drop rods", href: "/drop-rods" },
                { name: "Frames", href: "/frames" },
                { name: "Get a color quote", href: "/quote" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={COMPANY.mainSite}
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Main site · {COMPANY.mainSiteLabel}
                </a>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Staff COST estimator
                </Link>
              </li>
              <li className="text-sm text-zinc-400">
                {COMPANY.googleReviews.rating} · {COMPANY.googleReviews.count}{" "}
                Google Reviews
              </li>
              <li className="text-sm text-zinc-400">
                Financing on the main site: {COMPANY.financing}
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              {SAFE_FINISH_COPY}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 flex-shrink-0 text-zinc-500" />
                <a
                  href={`tel:${COMPANY.phoneTel}`}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  {COMPANY.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-zinc-500" />
                <span className="text-sm text-zinc-400">{COMPANY.hours}</span>
              </li>
              {COMPANY.locations.map((loc) => (
                <li key={loc.name} className="flex items-start gap-2.5">
                  <MapPin
                    size={15}
                    className="mt-0.5 flex-shrink-0 text-zinc-500"
                  />
                  <span className="text-sm text-zinc-400">
                    {loc.name}
                    <br />
                    {loc.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights
            reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Customer coat pricing is quote-only. Staff COST figures are vendor
            cost, not a public offer.
          </p>
        </div>
      </div>
    </footer>
  );
}
