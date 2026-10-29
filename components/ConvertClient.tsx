"use client";

import { useState } from "react";
import UploadZone, { LoadedFile, loadImage } from "@/components/UploadZone";
import { Download, RotateCcw } from "lucide-react";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

const FORMATS = [
  { mime: "image/png", label: "PNG", ext: "png" },
  { mime: "image/jpeg", label: "JPG", ext: "jpg" },
  { mime: "image/webp", label: "WebP", ext: "webp" },
];

export default function ConvertClient() {
  const [image, setImage] = useState<LoadedFile | null>(null);
  const [target, setTarget] = useState(FORMATS[0]);
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
      if (target.mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((r) =>
        canvas.toBlob((b) => r(b!), target.mime, target.mime === "image/png" ? undefined : 0.92)
      );
      setResult({ url: URL.createObjectURL(blob), blob });
      try {
        const items = JSON.parse(localStorage.getItem("is_history") || "[]");
        items.unshift({ tool: "convert", detail: `→ ${target.label}`, name: image.name, size: blob.size, at: new Date().toISOString() });
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
    a.download = (image?.name || "photo").replace(/\.[^.]+$/, "") + "." + target.ext;
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

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Convert to</label>
            <div className="mb-5 grid grid-cols-3 gap-1.5">
              {FORMATS.map((f) => (
                <button key={f.label} onClick={() => { setTarget(f); setResult(null); }} className={`rounded-lg px-2 py-2 text-xs font-medium transition ${target.label === f.label ? "bg-violet-500/15 text-white ring-1 ring-violet-500/50" : "text-zinc-400 hover:bg-white/5"}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <button onClick={run} disabled={busy} className="btn-primary w-full">{busy ? "Converting…" : "Convert image"}</button>
          </div>

          <div className="card flex min-h-[420px] flex-col p-5">
            {busy && (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  <p className="text-sm text-muted">Converting…</p>
                </div>
              </div>
            )}
            {!busy && !result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted">Pick a format and press “Convert image”.</p>
                <img src={image.url} alt="Original preview" className="max-h-[300px] rounded-xl object-contain" />
              </div>
            )}
            {!busy && result && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 font-semibold text-violet-300 ring-1 ring-violet-500/40">{target.label}</span>
                  <span>{formatBytes(result.blob.size)}</span>
                </div>
                <img src={result.url} alt={`Converted ${target.label} preview`} className="max-h-[280px] rounded-xl object-contain shadow-2xl" />
                <button onClick={download} className="btn-primary"><Download size={16} /> Download {target.label}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
