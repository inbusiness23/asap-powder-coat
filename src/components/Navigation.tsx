"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { COMPANY } from "@/lib/copy";

const navLinks = [
  { name: "Handles", href: "/handles" },
  { name: "Hinges", href: "/hinges" },
  { name: "Drop rods", href: "/drop-rods" },
  { name: "Frames", href: "/frames" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-sm">
      <div className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
          <span className="hidden text-zinc-400 sm:block">
            Licensed GC #{COMPANY.license} · {COMPANY.hours}
          </span>
          <span className="text-zinc-300">
            {COMPANY.googleReviews.rating} · {COMPANY.googleReviews.count} Google
            Reviews
          </span>
          <a
            href={`tel:${COMPANY.phoneTel}`}
            className="ml-auto flex items-center gap-2 font-semibold hover:text-brand-lime"
          >
            <Phone size={14} />
            {COMPANY.phoneDisplay}
          </a>
        </div>
      </div>

      <nav className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-brand-dark px-2.5 py-1.5 text-sm font-black leading-none text-brand-lime">
                ASAP
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-tight text-brand-dark">
                  {COMPANY.wordmark}
                </div>
                <div className="text-[10px] leading-tight text-zinc-500">
                  Powder coat / color finish
                </div>
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-brand-dark"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/quote"
              className="btn-primary hidden py-2.5 text-sm sm:inline-flex"
            >
              Get a color quote
            </Link>
            <button
              className="p-2 text-zinc-600 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              type="button"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-3 border-t border-zinc-100 pb-2 pt-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/quote"
              className="btn-primary mt-2 w-full"
              onClick={() => setMobileOpen(false)}
            >
              Get a color quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
