"use client";

import { useRef, useState, DragEvent } from "react";
import { UploadCloud } from "lucide-react";

export type LoadedFile = {
  file: File;
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
};

export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = url;
  });
}

export async function readImage(file: File): Promise<LoadedFile> {
  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  return { file, url, name: file.name, size: file.size, width: img.naturalWidth, height: img.naturalHeight };
}

const SAMPLES = [
  { label: "Product photo", make: makeProduct },
  { label: "Portrait", make: makePortrait },
  { label: "Landscape", make: makeLandscape },
];

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.92));
}

function makeProduct(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1200; c.height = 1200;
  const ctx = c.getContext("2d")!;
  const bg = ctx.createLinearGradient(0, 0, 0, 1200);
  bg.addColorStop(0, "#3c3c46");
  bg.addColorStop(1, "#5a5a68");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1200, 1200);
  const gr = ctx.createLinearGradient(0, 240, 0, 1020);
  gr.addColorStop(0, "#fffaf4");
  gr.addColorStop(1, "#f4c2a1");
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.roundRect(300, 240, 600, 780, 24);
  ctx.fill();
  ctx.fillStyle = "#2a2a33";
  ctx.beginPath();
  ctx.roundRect(520, 620, 160, 240, 16);
  ctx.fill();
  return c;
}

function makePortrait(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1080; c.height = 1350;
  const ctx = c.getContext("2d")!;
  const bg = ctx.createLinearGradient(0, 0, 0, 1350);
  bg.addColorStop(0, "#28304a");
  bg.addColorStop(1, "#64486e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = "#e8c3a0";
  ctx.beginPath();
  ctx.ellipse(540, 560, 220, 300, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3b2c28";
  ctx.beginPath();
  ctx.ellipse(540, 330, 240, 150, 0, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

function makeLandscape(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1600; c.height = 900;
  const ctx = c.getContext("2d")!;
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, "#1e2a5a");
  sky.addColorStop(1, "#e8a05c");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1600, 560);
  ctx.fillStyle = "#2d2d24";
  ctx.beginPath();
  ctx.arc(1180, 430, 90, 0, Math.PI * 2);
  ctx.fill();
  const ground = ctx.createLinearGradient(0, 560, 0, 900);
  ground.addColorStop(0, "#142015");
  ground.addColorStop(1, "#2d3b25");
  ctx.fillStyle = ground;
  ctx.fillRect(0, 560, 1600, 340);
  return c;
}

export default function UploadZone({
  onFile,
  accept = "image/*",
  hint = "PNG · JPG · WEBP · up to 10 MB",
  showSamples = true,
}: {
  onFile: (f: LoadedFile) => void;
  accept?: string;
  hint?: string;
  showSamples?: boolean;
}) {
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const loaded = await readImage(file);
      onFile(loaded);
    } catch {
      setError("That file could not be read as an image.");
    } finally {
      setBusy(false);
    }
  }

  async function loadSample(make: () => HTMLCanvasElement, name: string) {
    setError("");
    setBusy(true);
    try {
      const blob = await canvasToBlob(make());
      const file = new File([blob], name, { type: "image/jpeg" });
      const loaded = await readImage(file);
      onFile(loaded);
    } catch {
      setError("Sample image could not be loaded.");
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <div
        className={`dropzone flex cursor-pointer flex-col items-center justify-center px-6 py-12 text-center ${drag ? "drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload a photo"
      >
        <UploadCloud className="mb-3 text-violet-400" size={36} />
        <p className="font-semibold">{busy ? "Loading…" : "Upload a photo"}</p>
        <p className="mt-1 text-sm text-muted">or drag and drop</p>
        <p className="mt-3 text-xs text-zinc-500">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-3 text-center text-sm text-rose-400">{error}</p>}
      {showSamples && (
        <p className="mt-4 text-center text-sm text-muted">
          No photo? Try one:{" "}
          {SAMPLES.map((s, i) => (
            <span key={s.label}>
              <button onClick={() => loadSample(s.make, `${s.label.toLowerCase().replace(" ", "-")}.jpg`)} className="font-medium text-violet-300 underline-offset-2 hover:underline">{s.label}</button>
              {i < SAMPLES.length - 1 && <span className="text-zinc-600"> · </span>}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
