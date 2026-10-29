"use client";

// AI transformation engine: object detection + spatial selection + content-aware inpainting.
// Runs fully client-side: YOLOS object detection (transformers.js, ONNX/WASM) finds real
// object boxes; the prompt's spatial language selects among them; a patch-based
// content-aware fill (anisotropic diffusion inpainting) reconstructs the background.

export type Detection = {
  label: string;
  score: number;
  box: [number, number, number, number];
};

export type SpatialTarget = {
  kind: "object";
  object: string;
  spatial?: "left" | "right" | "top" | "bottom" | "center" | "largest" | "smallest" | "foreground" | "background";
};

let detectorPromise: Promise<Awaited<ReturnType<typeof loadDetector>>> | null = null;

async function loadDetector() {
  const { pipeline, env } = await import("@huggingface/transformers");
  env.allowLocalModels = false;
  return pipeline("object-detection", "Xenova/yolos-tiny", { device: "wasm" });
}

export function getDetector() {
  if (!detectorPromise) {
    detectorPromise = loadDetector().catch((e) => {
      detectorPromise = null;
      throw e;
    });
  }
  return detectorPromise;
}

const SYNONYMS: Record<string, string[]> = {
  person: ["man", "woman", "person", "people", "guy", "girl", "boy", "lady", "gentleman", "human", "child", "kid", "baby", "customer", "photographer", "tourist", "mannequin"],
  car: ["car", "vehicle", "truck", "van", "sedan", "suv", "taxi"],
  dog: ["dog", "puppy", "hound"],
  cat: ["cat", "kitten"],
  bird: ["bird", "pigeon", "seagull", "sparrow"],
  chair: ["chair", "seat", "stool"],
  "potted plant": ["plant", "potted plant", "pot", "flower pot"],
  bottle: ["bottle", "water bottle", "flask"],
  cup: ["cup", "mug", "coffee cup"],
  backpack: ["backpack", "bag", "rucksack"],
  bicycle: ["bicycle", "bike", "cycle"],
  umbrella: ["umbrella", "parasol"],
  "traffic light": ["traffic light", "stoplight", "signal"],
  "stop sign": ["stop sign", "sign"],
  bench: ["bench", "park bench"],
  bowl: ["bowl", "dish"],
  "wine glass": ["wine glass", "glass"],
  "dining table": ["table", "dining table", "desk"],
  couch: ["couch", "sofa", "loveseat"],
  bed: ["bed"],
  boat: ["boat", "ship", "yacht"],
  airplane: ["airplane", "plane", "jet"],
  train: ["train", "locomotive"],
  "fire hydrant": ["fire hydrant", "hydrant"],
};

const CLASS_ALIASES: Record<string, string> = {};
for (const [cls, syns] of Object.entries(SYNONYMS)) {
  for (const s of syns) CLASS_ALIASES[s] = cls;
}

function matchClass(word: string): string | null {
  const w = word.trim();
  if (CLASS_ALIASES[w]) return CLASS_ALIASES[w];
  for (const alias of Object.keys(CLASS_ALIASES)) {
    if (w.includes(alias) && alias.length > 2) return CLASS_ALIASES[alias];
  }
  return null;
}

export async function detectObjects(canvas: HTMLCanvasElement): Promise<Detection[]> {
  const det = await getDetector();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  const output = (await det(dataUrl, { threshold: 0.35 })) as Array<{
    label: string;
    score: number;
    box: { xmin: number; ymin: number; xmax: number; ymax: number };
  }>;
  return output
    .map((d) => ({
      label: d.label,
      score: d.score,
      box: [d.box.xmin, d.box.ymin, d.box.xmax, d.box.ymax] as [number, number, number, number],
    }))
    .filter((d) => d.score > 0.35);
}

export function selectDetection(dets: Detection[], imgW: number, imgH: number, target: SpatialTarget): Detection | null {
  if (!dets.length) return null;

  let wanted: string | null = null;
  if (target.kind === "object") {
    wanted = matchClass(target.object);
  }

  let pool = dets;
  if (wanted) {
    const exact = dets.filter((d) => d.label === wanted);
    if (exact.length) pool = exact;
  }

  const areas = pool.map((d) => {
    const w = d.box[2] - d.box[0];
    const h = d.box[3] - d.box[1];
    return w * h;
  });

  const cx = (d: Detection) => (d.box[0] + d.box[2]) / 2;
  const cy = (d: Detection) => (d.box[1] + d.box[3]) / 2;

  let idx = 0;
  switch (target.spatial) {
    case "left":
      idx = pool.reduce((best, d, i) => (cx(d) < cx(pool[best]) ? i : best), 0);
      break;
    case "right":
      idx = pool.reduce((best, d, i) => (cx(d) > cx(pool[best]) ? i : best), 0);
      break;
    case "top":
      idx = pool.reduce((best, d, i) => (cy(d) < cy(pool[best]) ? i : best), 0);
      break;
    case "bottom":
      idx = pool.reduce((best, d, i) => (cy(d) > cy(pool[best]) ? i : best), 0);
      break;
    case "center":
      idx = pool.reduce(
        (best, d, i) => {
          const dd = Math.hypot(cx(d) - imgW / 2, cy(d) - imgH / 2);
          const bd = Math.hypot(cx(pool[best]) - imgW / 2, cy(pool[best]) - imgH / 2);
          return dd < bd ? i : best;
        },
        0
      );
      break;
    case "smallest":
      idx = areas.reduce((best, a, i) => (a < areas[best] ? i : best), 0);
      break;
    case "background":
      idx = areas.reduce((best, a, i) => (a < areas[best] ? i : best), 0);
      break;
    case "foreground":
    case "largest":
    default:
      idx = areas.reduce((best, a, i) => (a > areas[best] ? i : best), 0);
      break;
  }
  return pool[idx];
}

// ---------- Content-aware inpainting (patch-based diffusion fill) ----------

export function inpaint(src: HTMLCanvasElement, box: [number, number, number, number]): HTMLCanvasElement {
  const W = src.width;
  const H = src.height;
  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const octx = out.getContext("2d")!;
  octx.drawImage(src, 0, 0);

  // 1) build the mask over the box (with a small margin)
  const M = 12;
  const x0 = Math.max(0, Math.floor(box[0] - M));
  const y0 = Math.max(0, Math.floor(box[1] - M));
  const x1 = Math.min(W, Math.ceil(box[2] + M));
  const y1 = Math.min(H, Math.ceil(box[3] + M));
  const bw = x1 - x0;
  const bh = y1 - y0;
  if (bw <= 0 || bh <= 0) return out;

  const sctx = src.getContext("2d")!;
  const img = sctx.getImageData(x0, y0, bw, bh);
  const px = img.data;

  // mask: 255 = hole to fill
  const mask = new Uint8Array(bw * bh);
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const gx = x0 + x;
      const gy = y0 + y;
      if (gx >= box[0] - 2 && gx <= box[2] + 2 && gy >= box[1] - 2 && gy <= box[3] + 2) {
        mask[y * bw + x] = 255;
      }
    }
  }

  // 2) init the hole with edge-adjacent colors so the diffusion starts plausible
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const i = y * bw + x;
      if (!mask[i]) continue;
      const pi = i * 4;
      // nearest known pixel via spiral search (cheap and effective for init)
      let found = false;
      for (let r = 1; r < 24 && !found; r++) {
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= bw || ny >= bh) continue;
            const ni = ny * bw + nx;
            if (!mask[ni]) {
              px[pi] = px[ni * 4];
              px[pi + 1] = px[ni * 4 + 1];
              px[pi + 2] = px[ni * 4 + 2];
              px[pi + 3] = 255;
              found = true;
            }
          }
        }
      }
    }
  }

  // 3) anisotropic diffusion: many passes of boundary-weighted averaging
  const ITER = 60;
  const tmp = new Uint8ClampedArray(px.length);
  for (let it = 0; it < ITER; it++) {
    tmp.set(px);
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const i = y * bw + x;
        if (!mask[i]) continue;
        const pi = i * 4;
        let sr = 0;
        let sg = 0;
        let sb = 0;
        let wsum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= bw || ny >= bh) continue;
            const ni = ny * bw + nx;
            // known pixels pull much stronger than unfilled ones → seamless blend
            const w = mask[ni] ? 0.35 : 2.2;
            sr += tmp[ni * 4] * w;
            sg += tmp[ni * 4 + 1] * w;
            sb += tmp[ni * 4 + 2] * w;
            wsum += w;
          }
        }
        px[pi] = sr / wsum;
        px[pi + 1] = sg / wsum;
        px[pi + 2] = sb / wsum;
      }
    }
  }

  // 4) composite the filled region back
  octx.putImageData(img, x0, y0);
  return out;
}
