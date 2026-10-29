"use client";

import { useState } from "react";
import UploadZone, { LoadedFile, loadImage } from "@/components/UploadZone";
import { Download, RotateCcw, Maximize2 } from "lucide-react";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

const ASPECTS = [
  { label: "16:9 Wide", ratio: 16 / 9 },
  { label: "4:5 Portrait", ratio: 4 / 5 },
  { label: "1:1 Square", ratio: 1 },
  { label: "9:16 Story", ratio: 9 / 16 },
];

export default function ExpandClient() {
  const [image, setImage] = useState<LoadedFile | null>(null);
  const [aspect, setAspect] = useState(ASPECTS[0]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; blob: Blob; w: number; h: number } | null>(null);

  async function run() {
    if (!image) return;
    setBusy(true);
    setResult(null);
    try {
      const img = await loadImage(image.url);
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      let cw = iw;
      let ch = ih;
      if (iw / ih > aspect.ratio) {
        cw = iw;
        ch = Math.round(iw / aspect.ratio);
      } else {
        ch = ih;
        cw = Math.round(ih * aspect.ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d")!;

      ctx.drawImage(img, 0, 0, iw, ih, 0, 0, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, -iw, 0, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, iw, 0, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, 0, -ih, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, 0, ih, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, -iw, -ih, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, iw, -ih, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, -iw, ih, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih, iw, ih, iw, ih);

      ctx.filter = "blur(40px)";
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = "none";
      ctx.drawImage(img, Math.round((cw - iw) / 2), Math.round((ch - ih) / 2), iw, ih);

      const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.92));
      setResult({ url: URL.createObjectURL(blob), blob, w: cw, h: ch });
      try {
        const items = JSON.parse(localStorage.getItem("is_history") || "[]");
        items.unshift({ tool: "expand", detail: `${aspect.label} (${cw}×${ch})`, name: image.name, size: blob.size, at: new Date().toISOString() });
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
    a.download = (image?.name || "photo").replace(/\.[^.]+$/, "") + `-expanded.jpg`;
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
                <p className="text-xs text-zinc-500">{aspect.label}</p>
              </div>
              <button onClick={() => { setImage(null); setResult(null); }} className="btn-ghost !px-3 !py-1.5 text-xs"><RotateCcw size={14} /> New</button>
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Target aspect</label>
            <div className="mb-5 space-y-1.5">
              {ASPECTS.map((a) => (
                <button key={a.label} onClick={() => { setAspect(a); setResult(null); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${aspect.label === a.label ? "bg-violet-500/15 text-white ring-1 ring-violet-500/50" : "text-zinc-300 hover:bg-white/5"}`}>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>

            <button onClick={run} disabled={busy} className="btn-primary w-full"><Maximize2 size={16} /> {busy ? "Expanding…" : "Expand image"}</button>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
              Edge-aware extension with soft falloff. Pro plan adds generative fill for new scene content.
            </p>
          </div>

          <div className="card flex min-h-[420px] flex-col p-5">
            {busy && (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  <p className="text-sm text-muted">Expanding to {aspect.label}…</p>
                </div>
              </div>
            )}
            {!busy && !result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted">Pick an aspect ratio and press “Expand image”.</p>
                <img src={image.url} alt="Original preview" className="max-h-[300px] rounded-xl object-contain" />
              </div>
            )}
            {!busy && result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 font-semibold text-violet-300 ring-1 ring-violet-500/40">{result.w} × {result.h}px</span>
                  <span>{formatBytes(result.blob.size)} · JPG</span>
                </div>
                <img src={result.url} alt={`Expanded ${aspect.label} preview`} className="max-h-[320px] rounded-xl object-contain shadow-2xl" style={{ maxWidth: "100%" }} />
                <button onClick={download} className="btn-primary"><Download size={16} /> Download JPG</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
