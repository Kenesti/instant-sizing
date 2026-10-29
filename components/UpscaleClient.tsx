"use client";

import { useState } from "react";
import UploadZone, { LoadedFile, loadImage } from "@/components/UploadZone";
import { Download, RotateCcw, Sparkles } from "lucide-react";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

const SCALES = [2, 4];

function upscaleCanvas(img: HTMLImageElement, scale: number): HTMLCanvasElement {
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  const tw = sw * scale;
  const th = sh * scale;

  const src = document.createElement("canvas");
  src.width = sw;
  src.height = sh;
  src.getContext("2d")!.drawImage(img, 0, 0);

  const out = document.createElement("canvas");
  out.width = tw;
  out.height = th;
  const octx = out.getContext("2d")!;
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = "high";
  octx.drawImage(src, 0, 0, sw, sh, 0, 0, tw, th);

  octx.globalCompositeOperation = "overlay";
  octx.globalAlpha = 0.35;
  octx.drawImage(out, 0, 0);
  octx.globalCompositeOperation = "source-over";
  octx.globalAlpha = 1;

  return out;
}

export default function UpscaleClient() {
  const [image, setImage] = useState<LoadedFile | null>(null);
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; blob: Blob; w: number; h: number } | null>(null);

  async function run() {
    if (!image) return;
    setBusy(true);
    setResult(null);
    try {
      const img = await loadImage(image.url);
      const canvas = upscaleCanvas(img, scale);
      const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png"));
      setResult({ url: URL.createObjectURL(blob), blob, w: canvas.width, h: canvas.height });
      try {
        const items = JSON.parse(localStorage.getItem("is_history") || "[]");
        items.unshift({ tool: "upscale", detail: `${scale}× (${canvas.width}×${canvas.height})`, name: image.name, size: blob.size, at: new Date().toISOString() });
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
    a.download = (image?.name || "photo").replace(/\.[^.]+$/, "") + `-upscaled-${result.w}x${result.h}.png`;
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

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Upscale factor</label>
            <div className="mb-5 grid grid-cols-2 gap-1.5">
              {SCALES.map((s) => (
                <button key={s} onClick={() => { setScale(s); setResult(null); }} className={`rounded-lg px-2 py-2 text-xs font-medium transition ${scale === s ? "bg-violet-500/15 text-white ring-1 ring-violet-500/50" : "text-zinc-400 hover:bg-white/5"}`}>
                  {s}× → {image.width * s} × {image.height * s}
                </button>
              ))}
            </div>

            <button onClick={run} disabled={busy} className="btn-primary w-full"><Sparkles size={16} /> {busy ? "Upscaling…" : "Upscale image"}</button>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
              Runs a high-quality multi-pass resample in your browser. Best results start from images under 1500px.
            </p>
          </div>

          <div className="card flex min-h-[420px] flex-col p-5">
            {busy && (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  <p className="text-sm text-muted">Upscaling {scale}×…</p>
                </div>
              </div>
            )}
            {!busy && !result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted">Pick a factor and press “Upscale image”.</p>
                <img src={image.url} alt="Original preview" className="max-h-[300px] rounded-xl object-contain" />
              </div>
            )}
            {!busy && result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 font-semibold text-violet-300 ring-1 ring-violet-500/40">{result.w} × {result.h}px</span>
                  <span>{formatBytes(result.blob.size)} · PNG</span>
                </div>
                <img src={result.url} alt={`Upscaled ${result.w}×${result.h} preview`} className="max-h-[280px] rounded-xl object-contain shadow-2xl" style={{ imageRendering: "auto", maxWidth: "100%" }} />
                <button onClick={download} className="btn-primary"><Download size={16} /> Download PNG</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
