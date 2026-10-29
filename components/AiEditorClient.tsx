"use client";

import { useState } from "react";
import UploadZone, { LoadedFile } from "@/components/UploadZone";
import { parsePrompt, EDIT_OPS_HELP } from "@/lib/promptParser";
import {
  srcToCanvas, removeBgAI, drawScaled, expandCanvas, cropToRatio, rotateCanvas, flipCanvas,
  upscaleCanvas, brightnessCanvas, contrastCanvas, saturationCanvas, temperatureCanvas,
  grayscaleCanvas, sepiaCanvas, invertCanvas, autoEnhanceCanvas, vignetteCanvas, grainCanvas,
  gaussianCanvas, sharpenCanvas, denoiseCanvas, borderCanvas, roundedCanvas, blurBgWithSubject,
} from "@/lib/imageOps";
import { detectObjects, selectDetection, inpaint } from "@/lib/aiTransform";
import { Download, RotateCcw, Sparkles, Wand2, Check } from "lucide-react";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

const QUICK_PROMPTS = [
  "Remove the man from the left side and blend the background seamlessly",
  "Remove the background and save as a transparent PNG",
  "Make it 1080 × 1350 for an Instagram post",
  "Auto-enhance, then sharpen a little",
  "Cinematic: add contrast, mute the colors, vignette",
  "Vintage: sepia, film grain, white border",
  "Blur the background like portrait mode",
  "Brighten 20% and make it pop",
  "Upscale 2× and compress for the web",
];

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

      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        setStatus(op.label);
        setProgress(Math.round(10 + (i / ops.length) * 80));

        if (op.kind === "remove-object") {
          setStatus("AI analyzing photo (object detection)…");
          if (!current) current = await srcToCanvas(image.file);
          const dets = await detectObjects(current);
          const target = selectDetection(dets, current.width, current.height, {
            kind: "object",
            object: op.object as string,
            spatial: op.spatial as ("left" | "right" | "top" | "bottom" | "center" | "largest" | "smallest") | undefined,
          });
          if (!target) {
            throw new Error(
              `Couldn't find a "${op.object as string}" in this photo. The AI detects people, cars, animals, furniture, and 70+ common object classes — try naming what's actually in the frame.`
            );
          }
          setStatus(`Removing the ${op.object as string} (${Math.round(target.score * 100)}% confidence) and blending the background…`);
          current = inpaint(current, target.box);
        } else if (op.kind === "remove-bg") {
          const blob = await removeBgAI(currentFile ?? image.file);
          current = await srcToCanvas(blob);
          currentFile = null;
        } else if (op.kind === "blur-bg") {
          current = await blurBgWithSubject(currentFile ?? image.file, op.strength as number);
          currentFile = null;
        } else {
          if (!current) current = await srcToCanvas(image.file);
          switch (op.kind) {
            case "resize":
              current = drawScaled(current, op.w as number, op.h as number, op.fit ? "fit" : "cover", op.bg as string);
              break;
            case "expand":
              current = expandCanvas(current, op.ratio as number);
              break;
            case "crop-ratio":
              current = cropToRatio(current, op.ratio as number);
              break;
            case "rotate":
              current = rotateCanvas(current, op.deg as number);
              break;
            case "flip":
              current = flipCanvas(current, op.axis as "x" | "y");
              break;
            case "upscale":
              current = upscaleCanvas(current, op.scale as number);
              break;
            case "brightness":
              current = brightnessCanvas(current, op.amount as number);
              break;
            case "contrast":
              current = contrastCanvas(current, op.amount as number);
              break;
            case "saturation":
              current = saturationCanvas(current, op.amount as number);
              break;
            case "temperature":
              current = temperatureCanvas(current, op.amount as number);
              break;
            case "grayscale":
              current = grayscaleCanvas(current);
              break;
            case "sepia":
              current = sepiaCanvas(current, op.amount as number);
              break;
            case "invert":
              current = invertCanvas(current);
              break;
            case "auto-enhance":
              current = autoEnhanceCanvas(current);
              break;
            case "vignette":
              current = vignetteCanvas(current, op.amount as number);
              break;
            case "grain":
              current = grainCanvas(current, op.amount as number);
              break;
            case "gaussian":
              current = gaussianCanvas(current, op.amount as number);
              break;
            case "sharpen":
              current = sharpenCanvas(current, op.amount as number);
              break;
            case "denoise":
              current = denoiseCanvas(current, op.amount as number);
              break;
            case "border":
              current = borderCanvas(current, op.width as number, op.color as string);
              break;
            case "rounded":
              current = roundedCanvas(current, op.radius as number);
              break;
            case "compress":
            case "convert":
              break;
          }
        }
        completed.push(op.label);
        setDone([...completed]);
      }

      const convert = ops.find((o) => o.kind === "convert") as { mime: string; ext: string } | undefined;
      const compress = ops.find((o) => o.kind === "compress") as { quality: number } | undefined;
      const removedBg = ops.some((o) => o.kind === "remove-bg");
      const mime = convert?.mime ?? (compress ? "image/jpeg" : removedBg ? "image/png" : "image/jpeg");
      const ext = convert?.ext ?? (mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg");
      const quality = compress ? compress.quality / 100 : 0.92;

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
      setError(e instanceof Error && e.message.startsWith("Couldn't find")
        ? e.message
        : "That edit could not run. The AI model needs a recent desktop browser (Chrome, Edge, or Firefox).");
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
              <button onClick={() => { setImage(null); setResult(null); setDone([]); setPrompt(""); }} className="btn-ghost !px-3 !py-1.5 text-xs"><RotateCcw size={14} /> New</button>
            </div>

            <label htmlFor="ai-prompt" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Describe your edit</label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="field mb-3 resize-none"
              placeholder="e.g. Remove the man on the left, auto-enhance, then save as PNG"
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

            <details className="mt-4 text-xs text-zinc-500">
              <summary className="cursor-pointer font-medium text-zinc-400 hover:text-zinc-200">Everything the editor understands</summary>
              <div className="mt-2 space-y-1.5 leading-relaxed">
                {EDIT_OPS_HELP.map((h, i) => <p key={i}>{h}</p>)}
              </div>
            </details>
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
