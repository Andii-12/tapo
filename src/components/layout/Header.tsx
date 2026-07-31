"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/3-hozort", label: "3 хөзөр" },
  { href: "/5-hozort", label: "5 хөзөр" },
  { href: "/tiim-ugui", label: "Тийм / Үгүй" },
  { href: "/natal", label: "Natal" },
  { href: "/buh-hozruud", label: "Бүх хөзөр" },
  { href: "/minii-unshlaga", label: "Миний уншлага" },
  { href: "/tuslamj", label: "Тусламж" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between md:h-16">
        <Link href="/" className="group font-serif text-2xl tracking-[0.12em]">
          <span
            aria-hidden
            className="mr-2 inline-block text-sm text-ink-soft transition group-hover:text-ink"
          >
            ✦
          </span>
          ТАРО
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Үндсэн цэс">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm transition-opacity hover:opacity-100 ${
                  active ? "text-ink" : "text-ink-muted opacity-80"
                }`}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-px w-full bg-ink"
                  />
                ) : null}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center border border-border"
            aria-label={open ? "Цэс хаах" : "Цэс нээх"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Цэс</span>
            <div className="flex w-4 flex-col gap-1">
              <span className="block h-px w-full bg-ink" />
              <span className="block h-px w-full bg-ink" />
              <span className="block h-px w-full bg-ink" />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-bg-white lg:hidden"
            aria-label="Мобайл цэс"
          >
            <div className="container-page flex flex-col py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-border py-3 text-sm last:border-0"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
