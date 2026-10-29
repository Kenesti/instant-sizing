"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const TOOLS = [
  { name: "AI Photo Editor", href: "/ai-editor" },
  { name: "Image Resizer", href: "/resize" },
  { name: "Image Compressor", href: "/compress" },
  { name: "Image Converter", href: "/convert" },
  { name: "Background Remover", href: "/background-remover" },
  { name: "AI Image Expand", href: "/expand" },
  { name: "AI Upscaler", href: "/upscale" },
];

export default function Header({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("is_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!toolsOpen) return;
    function onDocClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setToolsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);

  return (
    <header className={light ? "bg-[#0a0a0b]" : "sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-md"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white text-sm">S</span>
            <span className="text-lg font-bold tracking-tight">Insightsize</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            <div className="relative" ref={toolsRef}>
              <button
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                onClick={() => setToolsOpen((v) => !v)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${toolsOpen ? "bg-white/5 text-white" : "text-zinc-300 hover:text-white"}`}
              >
                Tools
                <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 origin-top rounded-xl border border-[#3a3a41] bg-[#1a1a1d] p-1.5 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8)] ring-1 ring-black/40 sm:w-80"
                >
                  {TOOLS.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      role="menuitem"
                      onClick={() => setToolsOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-violet-500/15 hover:text-white"
                    >
                      {t.name}
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-[#3a3a41]" />
                  <Link
                    href="/tools"
                    role="menuitem"
                    onClick={() => setToolsOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/15"
                  >
                    All tools →
                  </Link>
                </div>
              )}
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
