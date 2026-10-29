import { loadImage } from "@/components/UploadZone";

export type Src = Blob | HTMLCanvasElement;

export async function srcToCanvas(src: Src): Promise<HTMLCanvasElement> {
  if (src instanceof HTMLCanvasElement) return src;
  const url = URL.createObjectURL(src);
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

export function newCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

export function cloneCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const out = newCanvas(src.width, src.height);
  out.getContext("2d")!.drawImage(src, 0, 0);
  return out;
}

export async function removeBgAI(input: Blob): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  return removeBackground(input as File);
}

// ---------- geometry ----------

export function drawScaled(src: HTMLCanvasElement, w: number, h: number, mode: "fit" | "cover" | "stretch", bg = "#ffffff"): HTMLCanvasElement {
  const out = newCanvas(w, h);
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = bg;
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

export function expandCanvas(src: HTMLCanvasElement, ratio: number): HTMLCanvasElement {
  const iw = src.width;
  const ih = src.height;
  let cw = iw;
  let ch = ih;
  if (iw / ih > ratio) ch = Math.round(iw / ratio);
  else cw = Math.round(ih * ratio);
  const out = newCanvas(cw, ch);
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

export function cropToRatio(src: HTMLCanvasElement, ratio: number): HTMLCanvasElement {
  const iw = src.width;
  const ih = src.height;
  let cw = iw;
  let ch = ih;
  if (iw / ih > ratio) cw = Math.round(ih * ratio);
  else ch = Math.round(iw / ratio);
  const out = newCanvas(cw, ch);
  const ctx = out.getContext("2d")!;
  ctx.drawImage(src, Math.round((iw - cw) / 2), Math.round((ih - ch) / 2), cw, ch, 0, 0, cw, ch);
  return out;
}

export function rotateCanvas(src: HTMLCanvasElement, deg: number): HTMLCanvasElement {
  const swap = deg !== 180;
  const out = newCanvas(swap ? src.height : src.width, swap ? src.width : src.height);
  const ctx = out.getContext("2d")!;
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return out;
}

export function flipCanvas(src: HTMLCanvasElement, axis: "x" | "y"): HTMLCanvasElement {
  const out = cloneCanvas(src);
  const ctx = out.getContext("2d")!;
  ctx.clearRect(0, 0, out.width, out.height);
  ctx.translate(axis === "x" ? out.width : 0, axis === "y" ? out.height : 0);
  ctx.scale(axis === "x" ? -1 : 1, axis === "y" ? -1 : 1);
  ctx.drawImage(src, 0, 0);
  return out;
}

export function upscaleCanvas(src: HTMLCanvasElement, scale: number): HTMLCanvasElement {
  let out = drawScaled(src, src.width * scale, src.height * scale, "stretch");
  if (scale >= 4) {
    out = drawScaled(out, out.width, out.height, "stretch");
  }
  const ctx = out.getContext("2d")!;
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.35;
  ctx.drawImage(out, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  return out;
}

// ---------- tone / color (per-pixel) ----------

type PixelFn = (r: number, g: number, b: number) => [number, number, number];

function perPixel(src: HTMLCanvasElement, fn: PixelFn): HTMLCanvasElement {
  const out = cloneCanvas(src);
  const ctx = out.getContext("2d")!;
  const frame = ctx.getImageData(0, 0, out.width, out.height);
  const px = frame.data;
  for (let i = 0; i < px.length; i += 4) {
    const [r, g, b] = fn(px[i], px[i + 1], px[i + 2]);
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
  }
  ctx.putImageData(frame, 0, 0);
  return out;
}

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));

export function brightnessCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const delta = (amount / 100) * 128;
  return perPixel(src, (r, g, b) => [clamp255(r + delta), clamp255(g + delta), clamp255(b + delta)]);
}

export function contrastCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const c = 1 + amount / 100;
  const f = (v: number) => clamp255((v - 128) * c + 128);
  return perPixel(src, (r, g, b) => [f(r), f(g), f(b)]);
}

export function saturationCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const s = 1 + amount / 100;
  return perPixel(src, (r, g, b) => {
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    return [clamp255(l + (r - l) * s), clamp255(l + (g - l) * s), clamp255(l + (b - l) * s)];
  });
}

export function temperatureCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const t = (amount / 100) * 60;
  return perPixel(src, (r, g, b) => [clamp255(r + t), clamp255(g + t * 0.2), clamp255(b - t)]);
}

export function grayscaleCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  return perPixel(src, (r, g, b) => {
    const lum = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
    return [lum, lum, lum];
  });
}

export function sepiaCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const a = amount / 100;
  return perPixel(src, (r, g, b) => {
    const sr = clamp255(r * 0.393 + g * 0.769 + b * 0.189);
    const sg = clamp255(r * 0.349 + g * 0.686 + b * 0.168);
    const sb = clamp255(r * 0.272 + g * 0.534 + b * 0.131);
    return [clamp255(r + (sr - r) * a), clamp255(g + (sg - g) * a), clamp255(b + (sb - b) * a)];
  });
}

export function invertCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  return perPixel(src, (r, g, b) => [255 - r, 255 - g, 255 - b]);
}

// ---------- analysis-based ----------

export function autoEnhanceCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const small = drawScaled(src, 160, 160, "fit");
  const sctx = small.getContext("2d")!;
  const d = sctx.getImageData(0, 0, small.width, small.height).data;
  const hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 4) {
    hist[Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])]++;
  }
  const total = d.length / 4;
  let lo = 0;
  let hi = 255;
  let acc = 0;
  const clip = total * 0.005;
  for (let i = 0; i < 256; i++) {
    acc += hist[i];
    if (acc > clip) { lo = i; break; }
  }
  acc = 0;
  for (let i = 255; i >= 0; i--) {
    acc += hist[i];
    if (acc > clip) { hi = i; break; }
  }
  const range = Math.max(1, hi - lo);
  const gain = Math.min(1.6, 255 / range);
  const offset = -lo * gain;
  const g2 = (v: number) => clamp255(v * gain + offset);
  const stretched = perPixel(src, (r, g, b) => [g2(r), g2(g), g2(b)]);
  const withContrast = contrastCanvas(stretched, 8);
  return saturationCanvas(withContrast, 10);
}

// ---------- effects ----------

export function vignetteCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const out = cloneCanvas(src);
  const ctx = out.getContext("2d")!;
  const w = out.width;
  const h = out.height;
  const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, `rgba(0,0,0,${(amount / 100) * 0.75})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  return out;
}

export function grainCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const out = cloneCanvas(src);
  const ctx = out.getContext("2d")!;
  const frame = ctx.getImageData(0, 0, out.width, out.height);
  const px = frame.data;
  const strength = (amount / 100) * 45;
  for (let i = 0; i < px.length; i += 4) {
    const n = (Math.random() - 0.5) * strength;
    px[i] = clamp255(px[i] + n);
    px[i + 1] = clamp255(px[i + 1] + n);
    px[i + 2] = clamp255(px[i + 2] + n);
  }
  ctx.putImageData(frame, 0, 0);
  return out;
}

export function gaussianCanvas(src: HTMLCanvasElement, radius: number): HTMLCanvasElement {
  const out = cloneCanvas(src);
  const ctx = out.getContext("2d")!;
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(out, 0, 0);
  ctx.filter = "none";
  return out;
}

export function sharpenCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const a = amount / 100;
  const out = cloneCanvas(src);
  const ctx = out.getContext("2d")!;
  const blurred = cloneCanvas(src);
  const bctx = blurred.getContext("2d")!;
  bctx.filter = "blur(1.5px)";
  bctx.drawImage(src, 0, 0);
  bctx.filter = "none";
  const f1 = ctx.getImageData(0, 0, out.width, out.height);
  const f2 = bctx.getImageData(0, 0, out.width, out.height);
  const p1 = f1.data;
  const p2 = f2.data;
  const k = a * 1.8;
  for (let i = 0; i < p1.length; i += 4) {
    p1[i] = clamp255(p1[i] + (p1[i] - p2[i]) * k);
    p1[i + 1] = clamp255(p1[i + 1] + (p1[i + 1] - p2[i + 1]) * k);
    p1[i + 2] = clamp255(p2[i] + (p1[i + 2] - p2[i + 2]) * k);
  }
  ctx.putImageData(f1, 0, 0);
  return out;
}

export function denoiseCanvas(src: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const a = amount / 100;
  const out = cloneCanvas(src);
  const ctx = out.getContext("2d")!;
  const smooth = cloneCanvas(src);
  const sctx = smooth.getContext("2d")!;
  sctx.filter = "blur(1.2px)";
  sctx.drawImage(src, 0, 0);
  sctx.filter = "none";
  const f1 = ctx.getImageData(0, 0, out.width, out.height);
  const f2 = sctx.getImageData(0, 0, out.width, out.height);
  const p1 = f1.data;
  const p2 = f2.data;
  for (let i = 0; i < p1.length; i += 4) {
    p1[i] = clamp255(p1[i] * (1 - a) + p2[i] * a);
    p1[i + 1] = clamp255(p1[i + 1] * (1 - a) + p2[i + 1] * a);
    p1[i + 2] = clamp255(p1[i + 2] * (1 - a) + p2[i + 2] * a);
  }
  ctx.putImageData(f1, 0, 0);
  return out;
}

// ---------- finishing ----------

export function borderCanvas(src: HTMLCanvasElement, width: number, color: string): HTMLCanvasElement {
  const out = newCanvas(src.width + width * 2, src.height + width * 2);
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(src, width, width);
  return out;
}

export function roundedCanvas(src: HTMLCanvasElement, radius: number): HTMLCanvasElement {
  const out = newCanvas(src.width, src.height);
  const ctx = out.getContext("2d")!;
  const r = Math.min(radius, Math.min(out.width, out.height) / 2);
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(out.width, 0, out.width, out.height, r);
  ctx.arcTo(out.width, out.height, 0, out.height, r);
  ctx.arcTo(0, out.height, 0, 0, r);
  ctx.arcTo(0, 0, out.width, 0, r);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(src, 0, 0);
  return out;
}

// ---------- AI-subject composite ----------

export async function blurBgWithSubject(src: Src, strength: number): Promise<HTMLCanvasElement> {
  const original = await srcToCanvas(src);
  const srcBlob = src instanceof File ? src : await new Promise<Blob>((r) => original.toBlob((b) => r(b!), "image/png"));
  const subject = await srcToCanvas(await removeBgAI(srcBlob));

  const w = original.width;
  const h = original.height;

  const softMask = newCanvas(w, h);
  const mctx = softMask.getContext("2d")!;
  mctx.filter = "blur(6px)";
  mctx.drawImage(subject, 0, 0, w, h);
  mctx.filter = "none";

  const blurred = gaussianCanvas(original, strength);
  const octx = blurred.getContext("2d")!;
  octx.globalCompositeOperation = "destination-out";
  octx.drawImage(softMask, 0, 0);
  octx.globalCompositeOperation = "source-over";
  octx.drawImage(original, 0, 0);
  return blurred;
}
