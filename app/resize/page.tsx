"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import UploadZone, { LoadedFile, loadImage } from "@/components/UploadZone";
import { PLATFORMS } from "@/lib/presets";
import { Download, RotateCcw, Check } from "lucide-react";

type FitMode = "fit" | "cover" | "stretch";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ResizePage() {
  const [image, setImage] = useState<LoadedFile | null>(null);
  const [platform, setPlatform] = useState("instagram");
  const [presetName, setPresetName] = useState("Square Post");
  const [w, setW] = useState(1080);
  const [h, setH] = useState(1080);
  const [fit, setFit] = useState<FitMode>("cover");
  const [bg, setBg] = useState("#0a0a0b");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; blob: Blob; w: number; h: number } | null>(null);

  const activePlatform = PLATFORMS.find((p) => p.slug === platform)!;

  function selectPlatform(slug: string) {
    const p = PLATFORMS.find((x) => x.slug === slug)!;
    setPlatform(slug);
    setPresetName(p.presets[0].name);
    setW(p.presets[0].w);
    setH(p.presets[0].h);
    setResult(null);
  }

  function selectPreset(name: string) {
    setPresetName(name);
    const p = PLATFORMS.find((x) => x.slug === platform)?.presets.find((y) => y.name === name);
    if (p) {
      setW(p.w);
      setH(p.h);
    }
    setResult(null);
  }

  async function run() {
    if (!image) return;
    setBusy(true);
    setResult(null);
    try {
      const img = await loadImage(image.url);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      let dw = canvas.width;
      let dh = canvas.height;
      let dx = 0;
      let dy = 0;

      if (fit !== "stretch") {
        const scale = fit === "fit" ? Math.min(canvas.width / iw, canvas.height / ih) : Math.max(canvas.width / iw, canvas.height / ih);
        dw = iw * scale;
        dh = ih * scale;
        dx = (canvas.width - dw) / 2;
        dy = (canvas.height - dh) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92)
      );
      setResult({ url: URL.createObjectURL(blob), blob, w: canvas.width, h: canvas.height });
      recordHistory("resize", `${canvas.width}×${canvas.height}`, image.name, blob.size);
    } finally {
      setBusy(false);
    }
  }

  function recordHistory(tool: string, detail: string, name: string, size: number) {
    try {
      const key = "is_history";
      const items = JSON.parse(localStorage.getItem(key) || "[]");
      items.unshift({ tool, detail, name, size, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(items.slice(0, 50)));
    } catch {}
  }

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `insightsize-${w}x${h}.jpg`;
    a.click();
  }

  function reset() {
    setImage(null);
    setResult(null);
  }

  return (
    <>
      <Header />
      <ToolShell
        title="Free Image Resizer"
        subtitle="Resize one JPG, PNG, or WebP image to custom pixel dimensions or a social-media preset, then download the result. Runs entirely in your browser — nothing is uploaded to a server."
      >
        {!image ? (
          <UploadZone onFile={(f) => { setImage(f); setResult(null); }} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Original</p>
                  <p className="font-semibold">{image.width} × {image.height}px</p>
                  <p className="text-xs text-zinc-500">{formatBytes(image.size)}</p>
                </div>
                <button onClick={reset} className="btn-ghost !px-3 !py-1.5 text-xs"><RotateCcw size={14} /> New</button>
              </div>

              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Platform</label>
              <select value={platform} onChange={(e) => selectPlatform(e.target.value)} className="field mb-4">
                {PLATFORMS.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                <option value="custom">Custom</option>
              </select>

              {platform !== "custom" && (
                <>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Preset</label>
                  <div className="mb-4 max-h-44 space-y-1 overflow-y-auto pr-1">
                    {activePlatform.presets.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => selectPreset(p.name)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${presetName === p.name ? "bg-violet-500/15 text-white ring-1 ring-violet-500/50" : "text-zinc-300 hover:bg-white/5"}`}
                      >
                        <span>{p.name}</span>
                        <span className="text-xs text-zinc-500">{p.w} × {p.h}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Width (px)</label>
                  <input type="number" min={1} value={w} onChange={(e) => { setW(+e.target.value); setPlatform("custom"); setResult(null); }} className="field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Height (px)</label>
                  <input type="number" min={1} value={h} onChange={(e) => { setH(+e.target.value); setPlatform("custom"); setResult(null); }} className="field" />
                </div>
              </div>

              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Fit mode</label>
              <div className="mb-4 grid grid-cols-3 gap-1.5">
                {(["fit", "cover", "stretch"] as const).map((m) => (
                  <button key={m} onClick={() => setFit(m)} className={`rounded-lg px-2 py-2 text-xs font-medium capitalize transition ${fit === m ? "bg-violet-500/15 text-white ring-1 ring-violet-500/50" : "text-zinc-400 hover:bg-white/5"}`}>
                    {m === "fit" ? "Fit" : m === "cover" ? "Fill" : "Stretch"}
                  </button>
                ))}
              </div>

              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Padding color (Fit mode)</label>
              <div className="mb-5 flex gap-2">
                {["#0a0a0b", "#ffffff", "#f4f4f5", "#ec4899", "#22d3ee"].map((c) => (
                  <button key={c} onClick={() => setBg(c)} aria-label={`Set padding ${c}`} className={`h-8 w-8 rounded-lg border transition ${bg === c ? "ring-2 ring-violet-400" : "border-[#3f3f46]"}`} style={{ background: c }} />
                ))}
              </div>

              <button onClick={run} disabled={busy} className="btn-primary w-full">
                {busy ? "Resizing…" : "Resize image"}
              </button>
            </div>

            <div className="card flex min-h-[420px] flex-col p-5">
              {busy && (
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    <p className="text-sm text-muted">Resizing your image…</p>
                  </div>
                </div>
              )}
              {!busy && !result && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <p className="text-sm text-muted">Choose a preset and press “Resize image”.</p>
                  <img src={image.url} alt="Original preview" className="max-h-[300px] rounded-xl object-contain" />
                </div>
              )}
              {!busy && result && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1 text-emerald-400"><Check size={14} /> {result.w} × {result.h}px</span>
                    <span>{formatBytes(result.blob.size)}</span>
                    <span>JPG</span>
                  </div>
                  <img src={result.url} alt={`Resized preview ${result.w}×${result.h}`} className="max-h-[320px] rounded-xl object-contain shadow-2xl" style={{ maxWidth: "100%" }} />
                  <button onClick={download} className="btn-primary"><Download size={16} /> Download JPG</button>
                </div>
              )}
            </div>
          </div>
        )}
      </ToolShell>

      <section className="section border-t border-[#26262a]">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-bold">Pick a platform size guide</h2>
          <div className="flex flex-wrap gap-2.5">
            {PLATFORMS.slice(0, 8).map((p) => (
              <Link key={p.slug} href={`/sizes/${p.slug}`} className="btn-ghost !py-2 !px-4 text-sm">{p.name} sizes</Link>
            ))}
            <Link href="/sizes" className="btn-ghost !py-2 !px-4 text-sm !text-violet-300">All sizes →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
