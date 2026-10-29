"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scaling, Minimize2, Repeat, Eraser, Sparkles, Maximize2, LogOut, Zap } from "lucide-react";
import type React from "react";

const TOOL_META: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; color: string }> = {
  resize: { icon: Scaling, label: "Resize", color: "#8b5cf6" },
  compress: { icon: Minimize2, label: "Compress", color: "#22d3ee" },
  convert: { icon: Repeat, label: "Convert", color: "#f59e0b" },
  "background-remover": { icon: Eraser, label: "Background Remover", color: "#ec4899" },
  upscale: { icon: Sparkles, label: "Upscale", color: "#a3e635" },
  expand: { icon: Maximize2, label: "Expand", color: "#67e8f9" },
};

type HistoryItem = {
  tool: string;
  detail: string;
  name: string;
  size: number;
  at: string;
};

const SAMPLE_HISTORY: HistoryItem[] = [
  { tool: "resize", detail: "1080×1350", name: "sunset-product.jpg", size: 384000, at: new Date(Date.now() - 3600e3).toISOString() },
  { tool: "background-remover", detail: "Transparent PNG", name: "white-sneaker.png", size: 512000, at: new Date(Date.now() - 7200e3).toISOString() },
  { tool: "compress", detail: "42% smaller", name: "hero-banner.png", size: 218000, at: new Date(Date.now() - 26*3600e3).toISOString() },
  { tool: "resize", detail: "1080×1920", name: "story-teaser.jpg", size: 296000, at: new Date(Date.now() - 30*3600e3).toISOString() },
  { tool: "convert", detail: "→ WebP", name: "catalog-shot.png", size: 154000, at: new Date(Date.now() - 49*3600e3).toISOString() },
  { tool: "expand", detail: "16:9 (1920×1080)", name: "storefront.jpg", size: 442000, at: new Date(Date.now() - 52*3600e3).toISOString() },
];

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("is_user");
      if (!raw) {
        router.replace("/signup");
        return;
      }
      setUser(JSON.parse(raw));
      const h = localStorage.getItem("is_history");
      const items = h ? JSON.parse(h) : [];
      setHistory(items.length ? items : SAMPLE_HISTORY);
    } catch {
      router.replace("/signup");
    } finally {
      setMounted(true);
    }
  }, [router]);

  if (!mounted || !user) return null;

  const counts = Object.entries(
    history.reduce((acc: Record<string, number>, h) => {
      acc[h.tool] = (acc[h.tool] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const aiUses = history.filter((h) => h.tool === "background-remover" || h.tool === "upscale" || h.tool === "expand").length;
  const creditsLeft = Math.max(0, 5 - aiUses);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Hi, {user.name.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-sm text-muted">{user.email} · {user.plan} plan</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { localStorage.removeItem("is_user"); router.push("/"); }}
            className="btn-ghost"
          >
            <LogOut size={15} /> Log out
          </button>
          <Link href="/resize" className="btn-primary">New edit</Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Total edits</p>
          <p className="mt-2 text-3xl font-extrabold">{history.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">AI credits left today</p>
          <div className="mt-2 flex items-center gap-3">
            <Zap size={20} className={creditsLeft > 0 ? "text-amber-400" : "text-zinc-600"} />
            <p className="text-3xl font-extrabold">{creditsLeft}<span className="text-base font-semibold text-zinc-500"> / 5</span></p>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#26262a]">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500" style={{ width: `${(creditsLeft / 5) * 100}%` }} />
          </div>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Storage saved</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-400">
            {formatBytes(history.reduce((s, h) => s + (h.tool === "compress" ? h.size * 0.7 : h.size * 0.25), 0))}
          </p>
          <p className="mt-1 text-xs text-zinc-500">estimated across compress & resize</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold">Recent activity</h2>
          {history.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-sm text-muted">No edits yet. Your history will appear here.</p>
              <Link href="/resize" className="btn-primary">Make your first edit</Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#26262a]">
              {history.map((h, i) => {
                const meta = TOOL_META[h.tool] || { icon: Sparkles, label: h.tool, color: "#8b5cf6" };
                return (
                  <li key={i} className="flex items-center gap-4 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: meta.color + "1f", color: meta.color }}>
                      <meta.icon size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{h.name}</p>
                      <p className="text-xs text-zinc-500">{meta.label} · {h.detail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">{formatBytes(h.size)}</p>
                      <p className="text-[11px] text-zinc-600">{new Date(h.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold">Tool usage</h2>
            <ul className="space-y-3.5">
              {counts.map(([tool, count]) => {
                const meta = TOOL_META[tool] || { label: tool, color: "#8b5cf6" };
                const max = counts[0][1] || 1;
                return (
                  <li key={tool}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-zinc-300">{meta.label}</span>
                      <span className="text-zinc-500">{count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#26262a]">
                      <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: meta.color }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-6 ring-1 ring-violet-500/30">
            <h2 className="text-lg font-bold">Go Pro</h2>
            <p className="mt-2 text-sm text-muted">Unlimited AI background removal, batch tools, and priority models.</p>
            <Link href="/signup?plan=pro" className="btn-primary mt-4 w-full">Upgrade to Pro</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
