"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const TOOLS = [
  { name: "Image Resizer", href: "/resize" },
  { name: "Image Compressor", href: "/compress" },
  { name: "Image Converter", href: "/convert" },
  { name: "Background Remover", href: "/background-remover" },
  { name: "AI Image Expand", href: "/expand" },
  { name: "AI Upscaler", href: "/upscale" },
];

export default function Header({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("is_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <header className={light ? "bg-[#0a0a0b]" : "bg-[#0a0a0b]/80 backdrop-blur-md"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white text-sm">S</span>
            <span className="text-lg font-bold tracking-tight">Insightsize</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            <div className="group relative">
              <button className="text-sm font-medium text-zinc-300 transition hover:text-white">Tools <span className="text-zinc-500 text-xs">▾</span></button>
              <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="card p-2">
                  {TOOLS.map((t) => (
                    <Link key={t.href} href={t.href} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">{t.name}</Link>
                  ))}
                  <Link href="/tools" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-violet-300 hover:bg-white/5">All tools →</Link>
                </div>
              </div>
            </div>
            <Link href="/sizes" className="text-sm font-medium text-zinc-300 transition hover:text-white">Size guides</Link>
            <Link href="/compare" className="text-sm font-medium text-zinc-300 transition hover:text-white">Compare</Link>
            <Link href="/guides" className="text-sm font-medium text-zinc-300 transition hover:text-white">Guides</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-zinc-300 hover:text-white">{user.name.split(" ")[0]}</Link>
                <Link href="/dashboard" className="btn-primary !py-2 !px-4">Dashboard</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white">Log in</Link>
                <Link href="/signup" className="btn-primary !py-2 !px-4">Sign up free</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-zinc-300" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-[#26262a] py-4 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {TOOLS.map((t) => (
                <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5">{t.name}</Link>
              ))}
              <Link href="/sizes" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5">Size guides</Link>
              <Link href="/compare" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5">Compare</Link>
              <Link href="/guides" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5">Guides</Link>
              <div className="mt-3 flex gap-3 px-3">
                {user ? (
                  <Link href="/dashboard" className="btn-primary flex-1">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/login" className="btn-ghost flex-1">Log in</Link>
                    <Link href="/signup" className="btn-primary flex-1">Sign up free</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
