"use client";

import { useState } from "react";
import UploadZone, { LoadedFile, loadImage } from "@/components/UploadZone";
import { Download, RotateCcw, Sparkles, Wand2, Check } from "lucide-react";

type Op =
  | { kind: "remove-bg"; label: string }
  | { kind: "resize"; w: number; h: number; label: string }
  | { kind: "expand"; ratio: number; label: string }
  | { kind: "upscale"; scale: number; label: string }
  | { kind: "compress"; quality: number; label: string }
  | { kind: "convert"; mime: string; ext: string; label: string }
  | { kind: "grayscale"; label: string }
  | { kind: "blur-bg"; label: string }
  | { kind: "rotate"; deg: number; label: string }
  | { kind: "flip"; axis: "x" | "y"; label: string };

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

const QUICK_PROMPTS = [
  "Remove the background and save as a transparent PNG",
  "Make it 1080 × 1350 for an Instagram post",
  "Upscale 2× and convert to PNG",
  "Compress to a small WebP for the web",
  "Expand to 16:9 widescreen",
];

function parsePrompt(prompt: string): Op[] {
  const p = prompt.toLowerCase();
  const ops: Op[] = [];

  if (/remove (the )?background|transparent|cut ?out|isolate|no background/.test(p)) {
    ops.push({ kind: "remove-bg", label: "Remove background (AI segmentation)" });
  }
  if (/(blur|soften) (the )?background|blurred background|bokeh/.test(p)) {
    ops.push({ kind: "blur-bg", label: "Blur the background, keep the subject sharp" });
  }

  const dim = p.match(/(\d{2,4})\s*[x×by]\s*(\d{2,4})/);
  if (/instagram|ig\b/.test(p)) {
    if (/story|reel/.test(p)) ops.push({ kind: "resize", w: 1080, h: 1920, label: "Resize to 1080 × 1920 (Instagram Story)" });
    else if (/profile|avatar|pfp/.test(p)) ops.push({ kind: "resize", w: 400, h: 400, label: "Resize to 400 × 400 (profile picture)" });
    else ops.push({ kind: "resize", w: 1080, h: 1350, label: "Resize to 1080 × 1350 (Instagram post)" });
  } else if (/youtube|thumbnail/.test(p)) {
    ops.push({ kind: "resize", w: 1280, h: 720, label: "Resize to 1280 × 720 (YouTube thumbnail)" });
  } else if (dim) {
    ops.push({ kind: "resize", w: +dim[1], h: +dim[2], label: `Resize to ${dim[1]} × ${dim[2]}` });
  } else if (/square/.test(p)) {
    ops.push({ kind: "resize", w: 1080, h: 1080, label: "Resize to 1080 × 1080 (square)" });
  }

  if (/expand|uncrop|widen/.test(p) || /16:9|widescreen/.test(p)) {
    if (!/16:9|widescreen/.test(p) && /9:16|story/.test(p)) ops.push({ kind: "expand", ratio: 9 / 16, label: "Expand to 9:16" });
    else ops.push({ kind: "expand", ratio: 16 / 9, label: "Expand to 16:9 widescreen" });
  }

  if (/upscale|enlarge|bigger|higher resolution|sharper|sharpen/.test(p) || /4x|4×/.test(p)) {
    ops.push({ kind: "upscale", scale: /4x|4×/.test(p) ? 4 : 2, label: `Upscale ${/4x|4×/.test(p) ? "4" : "2"}×` });
  }

  if (/black ?and ?white|grayscale|greyscale|mono/.test(p)) {
    ops.push({ kind: "grayscale", label: "Convert to black & white" });
  }
  if (/rotate/.test(p)) {
    const deg = /left|counter/.test(p) ? -90 : 180;
    ops.push({ kind: "rotate", deg, label: `Rotate ${deg}°` });
  }
  if (/flip/.test(p)) {
    ops.push({ kind: "flip", axis: /horizontal|side/.test(p) ? "x" : "y", label: "Flip" });
  }

  if (/compress|smaller file|reduce size|lighter|for (the )?web|faster/.test(p)) {
    const q = /a lot|heavily|tiny/.test(p) ? 45 : 75;
    ops.push({ kind: "compress", quality: q, label: `Compress (${q}% quality)` });
  }
  if (/\.?webp/.test(p) || /as webp/.test(p)) {
    ops.push({ kind: "convert", mime: "image/webp", ext: "webp", label: "Convert to WebP" });
  } else if (/\.?png|transparent png/.test(p)) {
    ops.push({ kind: "convert", mime: "image/png", ext: "png", label: "Convert to PNG" });
  } else if (/\.?jpe?g/.test(p)) {
    ops.push({ kind: "convert", mime: "image/jpeg", ext: "jpg", label: "Convert to JPG" });
  }

  return ops;
}

async function applyRemoveBg(input: Blob): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  return removeBackground(input as File);
}

async function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext("2d")!.drawImage(img, 0, 0);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawScaled(src: HTMLCanvasElement, w: number, h: number, mode: "fit" | "cover" | "stretch"): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(w));
  out.height = Math.max(1, Math.round(h));
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  const iw = src.width;
  const ih = src.height;
  let dw = out.width;
  let dh = out.height;
  let dx = 0;
  let dy = 0;
  if (mode !== "stretch") {
    const scale = mode === "fit" ? Math.min(out.width / iw, out.height / ih) : Math.max(out.width / iw, out.height / ih);
    dw = iw * scale;
    dh = ih * scale;
    dx = (out.width - dw) / 2;
    dy = (out.height - dh) / 2;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, dx, dy, dw, dh);
  return out;
}

function expandCanvas(src: HTMLCanvasElement, ratio: number): HTMLCanvasElement {
  const iw = src.width;
  const ih = src.height;
  let cw = iw;
  let ch = ih;
  if (iw / ih > ratio) ch = Math.round(iw / ratio);
  else cw = Math.round(ih * ratio);
  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  const ctx = out.getContext("2d")!;
  for (const [dx, dy] of [[0, 0], [-iw, 0], [iw, 0], [0, -ih], [0, ih], [-iw, -ih], [iw, -ih], [-iw, ih], [iw, ih]] as const) {
    ctx.drawImage(src, dx, dy);
  }
  ctx.filter = "blur(40px)";
  ctx.drawImage(out, 0, 0);
  ctx.filter = "none";
  ctx.drawImage(src, Math.round((cw - iw) / 2), Math.round((ch - ih) / 2));
  return out;
}

function upscaleCanvas(src: HTMLCanvasElement, scale: number): HTMLCanvasElement {
  const out = drawScaled(src, src.width * scale, src.height * scale, "stretch");
  const ctx = out.getContext("2d")!;
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.35;
  ctx.drawImage(out, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  return out;
}

function grayscaleCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = src.width;
  out.height = src.height;
  const ctx = out.getContext("2d")!;
  ctx.drawImage(src, 0, 0);
  const frame = ctx.getImageData(0, 0, out.width, out.height);
  const px = frame.data;
  for (let i = 0; i < px.length; i += 4) {
    const g = Math.round(px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114);
    px[i] = px[i + 1] = px[i + 2] = g;
  }
  ctx.putImageData(frame, 0, 0);
  return out;
}

function blurBgCanvas(src: HTMLCanvasElement, radius = 14): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = src.width;
  out.height = src.height;
  const ctx = out.getContext("2d")!;
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(src, 0, 0);
  ctx.filter = "none";
  return out;
}

async function blurBgWithSubject(source: File | HTMLCanvasElement): Promise<HTMLCanvasElement> {
  const original = source instanceof File ? await blobToCanvas(await (await fetch(URL.createObjectURL(source))).blob()) : source;
  const subjectBlob = await applyRemoveBg(source instanceof File ? source : await new Promise<Blob>((r) => original.toBlob((b) => r(b!), "image/png")));
  const subject = await blobToCanvas(subjectBlob);

  const w = original.width;
  const h = original.height;

  const softMask = document.createElement("canvas");
  softMask.width = w;
  softMask.height = h;
  const mctx = softMask.getContext("2d")!;
  mctx.filter = "blur(6px)";
  mctx.drawImage(subject, 0, 0, w, h);
  mctx.filter = "none";

  const blurred = blurBgCanvas(original);
  const octx = blurred.getContext("2d")!;
  octx.globalCompositeOperation = "destination-out";
  octx.drawImage(softMask, 0, 0);
  octx.globalCompositeOperation = "source-over";
  octx.drawImage(original, 0, 0);
  return blurred;
}

function rotateCanvas(src: HTMLCanvasElement, deg: number): HTMLCanvasElement {
  const swap = deg !== 180;
  const out = document.createElement("canvas");
  out.width = swap ? src.height : src.width;
  out.height = swap ? src.width : src.height;
  const ctx = out.getContext("2d")!;
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return out;
}

function flipCanvas(src: HTMLCanvasElement, axis: "x" | "y"): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = src.width;
  out.height = src.height;
  const ctx = out.getContext("2d")!;
  ctx.translate(axis === "x" ? out.width : 0, axis === "y" ? out.height : 0);
  ctx.scale(axis === "x" ? -1 : 1, axis === "y" ? -1 : 1);
  ctx.drawImage(src, 0, 0);
  return out;
}

export default function AiEditorClient() {
  const [image, setImage] = useState<LoadedFile | null>(null);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [result, setResult] = useState<{ url: string; blob: Blob; ext: string } | null>(null);
  const [error, setError] = useState("");

  const previewOps = prompt.trim() ? parsePrompt(prompt) : [];

  async function run() {
    if (!image || !prompt.trim()) return;
    const ops = parsePrompt(prompt);
    if (!ops.length) {
      setError("Couldn't understand that edit. Try one of the examples below.");
      return;
    }
    setError("");
    setBusy(true);
    setResult(null);
    setDone([]);
    setProgress(5);
    const completed: string[] = [];
    try {
      let current: HTMLCanvasElement | null = null;
      let currentFile: File | null = null;
      let ext = "png";

      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        setStatus(op.label);
        setProgress(Math.round(10 + (i / ops.length) * 80));

        if (op.kind === "remove-bg") {
          const src = currentFile ?? image.file;
          const blob = await applyRemoveBg(src);
          current = await blobToCanvas(blob);
          currentFile = null;
          ext = "png";
        } else {
          if (!current) current = await blobToCanvas(await (await fetch(image.url)).blob());
          switch (op.kind) {
            case "resize":
              current = drawScaled(current, op.w, op.h, "cover");
              break;
            case "expand":
              current = expandCanvas(current, op.ratio);
              break;
            case "upscale":
              current = upscaleCanvas(current, op.scale);
              break;
            case "grayscale":
              current = grayscaleCanvas(current);
              break;
            case "blur-bg": {
              const src = currentFile ?? image.file;
              current = await blurBgWithSubject(src);
              currentFile = null;
              break;
            }
            case "rotate":
              current = rotateCanvas(current, op.deg);
              break;
            case "flip":
              current = flipCanvas(current, op.axis);
              break;
            case "compress":
            case "convert":
              break;
          }
        }
        completed.push(op.label);
        setDone([...completed]);
      }

      const last = ops[ops.length - 1];
      const mime = last.kind === "convert" ? last.mime : last.kind === "compress" ? (ops.some((o) => o.kind === "convert" && o.mime === "image/webp") ? "image/webp" : "image/jpeg") : ops.some((o) => o.kind === "remove-bg") ? "image/png" : "image/jpeg";
      ext = last.kind === "convert" ? last.ext : last.kind === "compress" ? (mime === "image/webp" ? "webp" : "jpg") : mime === "image/png" ? "png" : "jpg";
      const quality = ops.some((o) => o.kind === "compress") ? (ops.find((o) => o.kind === "compress") as Extract<Op, { kind: "compress" }>).quality / 100 : 0.92;

      if (!current) throw new Error("no canvas");
      const blob = await new Promise<Blob>((r) =>
        current!.toBlob((b) => r(b!), mime, mime === "image/png" ? undefined : quality)
      );
      setResult({ url: URL.createObjectURL(blob), blob, ext });
      setProgress(100);

      try {
        const items = JSON.parse(localStorage.getItem("is_history") || "[]");
        items.unshift({ tool: "ai-editor", detail: ops.map((o) => o.label).join(" + "), name: image.name, size: blob.size, at: new Date().toISOString() });
        localStorage.setItem("is_history", JSON.stringify(items.slice(0, 50)));
      } catch {}
    } catch (e) {
      console.error(e);
      setError("That edit could not run. The AI model needs a recent desktop browser (Chrome, Edge, or Firefox).");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = (image?.name || "photo").replace(/\.[^.]+$/, "") + "-edited." + result.ext;
    a.click();
  }

  return (
    <div>
      {!image ? (
        <UploadZone onFile={setImage} hint="PNG · JPG · WEBP · up to 10 MB" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Original</p>
                <p className="font-semibold">{image.width} × {image.height}px · {formatBytes(image.size)}</p>
              </div>
              <button onClick={() => { setImage(null); setResult(null); setDone([]); }} className="btn-ghost !px-3 !py-1.5 text-xs"><RotateCcw size={14} /> New</button>
            </div>

            <label htmlFor="ai-prompt" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Describe your edit</label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="field mb-3 resize-none"
              placeholder="e.g. Remove the background, make it 1080 × 1350 for Instagram, and save as PNG"
              disabled={busy}
            />

            {previewOps.length > 0 && !busy && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {previewOps.map((o, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-200">
                    <Wand2 size={11} /> {o.label}
                  </span>
                ))}
              </div>
            )}

            <p className="mb-1.5 text-xs text-zinc-500">Try:</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => setPrompt(q)}
                  disabled={busy}
                  className="rounded-lg border border-[#3a3a41] px-2.5 py-1.5 text-[11px] text-zinc-400 transition hover:border-violet-500/50 hover:text-zinc-200"
                >
                  {q}
                </button>
              ))}
            </div>

            <button onClick={run} disabled={busy || !prompt.trim()} className="btn-primary w-full">
              <Sparkles size={16} /> {busy ? "Editing…" : "Apply edit"}
            </button>

            {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

            {done.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-[#26262a] pt-4">
                {done.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-zinc-300"><Check size={13} className="text-emerald-400" /> {d}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <div className="mb-3">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Result</p>
              <p className="font-semibold">{busy ? "Processing…" : result ? "Done — ready to download" : "Your edited photo appears here"}</p>
            </div>
            <div className="relative flex min-h-[320px] items-center justify-center rounded-xl bg-[#1a1a1d] p-3" style={result ? { backgroundImage: "linear-gradient(45deg,#26262a 25%,transparent 25%),linear-gradient(-45deg,#26262a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#26262a 75%),linear-gradient(-45deg,transparent 75%,#26262a 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0", backgroundColor: "#131315" } : undefined}>
              {busy && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#0a0a0b]/70 backdrop-blur-sm">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  <p className="text-sm text-zinc-300">{status}</p>
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#26262a]">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              {result ? (
                <img src={result.url} alt="Edited result" className="max-h-[340px] rounded-lg object-contain" />
              ) : (
                !busy && (
                  <img src={image.url} alt="Original preview" className="max-h-[340px] rounded-lg object-contain opacity-90" />
                )
              )}
            </div>
            {result && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-zinc-500">{formatBytes(result.blob.size)} · {result.ext.toUpperCase()}</p>
                <button onClick={download} className="btn-primary"><Download size={16} /> Download {result.ext.toUpperCase()}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
