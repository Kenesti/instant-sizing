"use client";

import { useState } from "react";
import UploadZone, { LoadedFile, loadImage } from "@/components/UploadZone";
import { Download, RotateCcw } from "lucide-react";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

export default function CompressClient() {
  const [image, setImage] = useState<LoadedFile | null>(null);
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp">("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);

  async function run() {
    if (!image) return;
    setBusy(true);
    setResult(null);
    try {
      const img = await loadImage(image.url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((r) =>
        canvas.toBlob((b) => r(b!), format, quality / 100)
      );
      setResult({ url: URL.createObjectURL(blob), blob });
      try {
        const items = JSON.parse(localStorage.getItem("is_history") || "[]");
        items.unshift({ tool: "compress", detail: `${Math.max(0, Math.round((1 - blob.size / image.size) * 100))}% smaller`, name: image.name, size: blob.size, at: new Date().toISOString() });
        localStorage.setItem("is_history", JSON.stringify(items.slice(0, 50)));
      } catch {}
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = (image?.name || "photo").replace(/\.[^.]+$/, "") + (format === "image/webp" ? "-compressed.webp" : "-compressed.jpg");
    a.click();
  }

  return (
    <div>
      {!image ? (
        <UploadZone onFile={setImage} hint="PNG · JPG · WEBP · up to 10 MB" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Original</p>
                <p className="font-semibold">{image.width} × {image.height}px</p>
                <p className="text-xs text-zinc-500">{formatBytes(image.size)}</p>
              </div>
              <button onClick={() => { setImage(null); setResult(null); }} className="btn-ghost !px-3 !py-1.5 text-xs"><RotateCcw size={14} /> New</button>
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Output format</label>
            <div className="mb-5 grid grid-cols-2 gap-1.5">
              {(["image/jpeg", "image/webp"] as const).map((f) => (
                <button key={f} onClick={() => { setFormat(f); setResult(null); }} className={`rounded-lg px-2 py-2 text-xs font-medium transition ${format === f ? "bg-violet-500/15 text-white ring-1 ring-violet-500/50" : "text-zinc-400 hover:bg-white/5"}`}>
                  {f === "image/jpeg" ? "JPG" : "WebP"}
                </button>
              ))}
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Quality: {quality}%</label>
            <input type="range" min={10} max={95} value={quality} onChange={(e) => setQuality(+e.target.value)} className="mb-5 w-full accent-violet-500" />

            <button onClick={run} disabled={busy} className="btn-primary w-full">{busy ? "Compressing…" : "Compress image"}</button>
          </div>

          <div className="card flex min-h-[420px] flex-col p-5">
            {busy && (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  <p className="text-sm text-muted">Compressing…</p>
                </div>
              </div>
            )}
            {!busy && !result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted">Pick a quality level and press “Compress image”.</p>
                <img src={image.url} alt="Original preview" className="max-h-[300px] rounded-xl object-contain" />
              </div>
            )}
            {!busy && result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                {image.size > 0 && (
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-emerald-400">−{Math.max(0, Math.round((1 - result.blob.size / image.size) * 100))}%</p>
                    <p className="text-xs text-zinc-500">{formatBytes(image.size)} → {formatBytes(result.blob.size)}</p>
                  </div>
                )}
                <img src={result.url} alt="Compressed preview" className="max-h-[280px] rounded-xl object-contain shadow-2xl" />
                <button onClick={download} className="btn-primary"><Download size={16} /> Download</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
