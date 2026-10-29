export type Op = {
  kind: string;
  label: string;
  prio: number;
  [k: string]: unknown;
};

const RATIO = /(\d{1,2})\s*[:\/]\s*(\d{1,2})/;
const DIM = /(\d{2,4})\s*[x×by]+\s*(\d{2,4})/;

function adverbScale(p: string): number {
  if (/slightly|a bit|a little|subtle|gently|barely/.test(p)) return 0.5;
  if (/much|a lot|heavily|strongly|way|significantly|super/.test(p)) return 1.7;
  return 1;
}

function pct(p: string, base: number, clamp = 100): number {
  const m = p.match(/(\d{1,3})\s*%/);
  let v = m ? +m[1] : base;
  if (!m) v = base * adverbScale(p);
  return Math.max(5, Math.min(clamp, Math.round(v)));
}

function px(p: string, base: number, clamp = 60): number {
  const m = p.match(/(\d{1,3})\s*px/);
  let v = m ? +m[1] : base;
  if (!m) v = base * adverbScale(p);
  return Math.max(2, Math.min(clamp, Math.round(v)));
}

function ratioOf(p: string): number | null {
  const m = p.match(RATIO);
  if (!m) return null;
  const a = +m[1];
  const b = +m[2];
  if (!a || !b) return null;
  return a / b;
}

function platformResize(p: string, fit: boolean, bg: string): Op | null {
  const dim = p.match(DIM);
  if (/instagram|ig\b/.test(p)) {
    if (/story|reel/.test(p)) return { kind: "resize", w: 1080, h: 1920, fit, bg, label: "Instagram Story 1080 × 1920", prio: 30 };
    if (/profile|avatar|pfp|picture/.test(p)) return { kind: "resize", w: 400, h: 400, fit, bg, label: "Instagram profile 400 × 400", prio: 30 };
    return { kind: "resize", w: 1080, h: 1350, fit, bg, label: "Instagram post 1080 × 1350", prio: 30 };
  }
  if (/youtube/.test(p)) return { kind: "resize", w: 1280, h: 720, fit, bg, label: "YouTube thumbnail 1280 × 720", prio: 30 };
  if (/tiktok/.test(p)) return { kind: "resize", w: 1080, h: 1920, fit, bg, label: "TikTok 1080 × 1920", prio: 30 };
  if (/twitter|x post/.test(p)) return { kind: "resize", w: 1200, h: 675, fit, bg, label: "X/Twitter post 1200 × 675", prio: 30 };
  if (/linkedin/.test(p)) return { kind: "resize", w: 1200, h: 627, fit, bg, label: "LinkedIn post 1200 × 627", prio: 30 };
  if (/facebook/.test(p)) return { kind: "resize", w: 1080, h: 1350, fit, bg, label: "Facebook post 1080 × 1350", prio: 30 };
  if (/pinterest/.test(p)) return { kind: "resize", w: 1000, h: 1500, fit, bg, label: "Pinterest pin 1000 × 1500", prio: 30 };
  if (dim) return { kind: "resize", w: +dim[1], h: +dim[2], fit, bg, label: `Resize to ${dim[1]} × ${dim[2]}`, prio: 30 };
  if (/square/.test(p)) return { kind: "resize", w: 1080, h: 1080, fit, bg, label: "Square 1080 × 1080", prio: 30 };
  return null;
}

export function parsePrompt(prompt: string): Op[] {
  const p = prompt.toLowerCase();
  const ops: Op[] = [];
  const push = (o: Op) => {
    if (!ops.some((x) => x.kind === o.kind)) ops.push(o);
  };

  const noCrop = /without cropp?ing|don'?t crop|do not crop|fit (the )?(whole|entire)|see the whole|no crop/.test(p);
  const bg = /black (background|bars?)/.test(p) ? "#000000" : /white (background|bars?)/.test(p) ? "#ffffff" : "#ffffff";
  const ratio = ratioOf(p);

  // --- Subject / background (real AI segmentation) ---
  const removedBg = /remove (the )?background|transparent|cut ?out|isolate|no background|knock ?out/.test(p);
  if (removedBg) {
    push({ kind: "remove-bg", label: "Remove background (AI segmentation)", prio: 50 });
  }
  if (/(blur|soften) (the )?background|blurred background|bokeh|portrait mode|depth of field/.test(p)) {
    push({ kind: "blur-bg", strength: px(p, 16, 40), label: `Blur background ${px(p, 16, 40)}px (AI subject mask)`, prio: 48 });
  }

  // --- Geometry ---
  if (/rotate|turn it/.test(p)) {
    const deg = /left|counter|ccw|anti/.test(p) ? -90 : /180|upside|flip it around/.test(p) ? 180 : 90;
    push({ kind: "rotate", deg, label: `Rotate ${deg}°`, prio: 40 });
  }
  if (/flip|mirror/.test(p)) {
    push({ kind: "flip", axis: /horizontal|side|mirror/.test(p) ? "x" : "y", label: /horizontal|side|mirror/.test(p) ? "Flip horizontally" : "Flip vertically", prio: 39 });
  }
  if (/crop/.test(p) && ratio && !noCrop) {
    const a = +p.match(RATIO)![1];
    const b = +p.match(RATIO)![2];
    push({ kind: "crop-ratio", ratio, label: `Crop to ${a}:${b}`, prio: 32 });
  }
  if (/expand|uncrop|widen|extend/.test(p) && ratio) {
    push({ kind: "expand", ratio, label: `Expand to ${ratio > 1 ? "widescreen" : "portrait"} ${p.match(RATIO)![1]}:${p.match(RATIO)![2]}`, prio: 31 });
  } else if ((/expand|uncrop|widen|extend/.test(p) || /16:9|widescreen|banner/.test(p)) && !ratio) {
    push({ kind: "expand", ratio: 16 / 9, label: "Expand to 16:9 widescreen", prio: 31 });
  }
  if (!/crop/.test(p) || noCrop) {
    const pr = platformResize(p, noCrop, bg);
    if (pr) push(pr);
  }
  if (/upscale|enlarge|bigger|higher resolution|hi-?res|4k|8k/.test(p) || /\b[248]x\b|[248]×/.test(p)) {
    const scale = /[48]x\b|[48]×|\b4k\b|\b8k\b/.test(p) ? 4 : 2;
    push({ kind: "upscale", scale, label: `Upscale ${scale}×`, prio: 25 });
  }

  // --- Color & tone ---
  if (/auto[- ]?enhance|fix (the )?(lighting|exposure)|correct|professional|make it pop|punch (it )?up|better colors/.test(p)) {
    push({ kind: "auto-enhance", label: "Auto-enhance (histogram + tone)", prio: 20 });
  }
  if (/bright(en|er)|lighter|exposure|dark(en|er)|darker/.test(p)) {
    const neg = /dark|underexpos/.test(p) && !/bright|overexpos/.test(p);
    const v = pct(p, neg ? -15 : 15, 80);
    push({ kind: "brightness", amount: neg ? -Math.abs(v) : Math.abs(v), label: `${neg ? "Darken" : "Brighten"} ${Math.abs(v)}%`, prio: 19 });
  }
  if (/contrast|punchy|dramatic/.test(p)) {
    const v = pct(p, 15);
    push({ kind: "contrast", amount: v, label: `Contrast +${v}%`, prio: 18 });
  }
  if (/saturat|vivid|vibrant|colorful|desaturat|dull|muted/.test(p)) {
    const neg = /desaturat|dull|muted/.test(p);
    const v = neg ? -pct(p, 40) : pct(p, 20);
    push({ kind: "saturation", amount: v, label: `Saturation ${v > 0 ? "+" : ""}${v}%`, prio: 17 });
  }
  if (/warm(er|th)?\b|golden tone|sunset tone/.test(p)) {
    push({ kind: "temperature", amount: pct(p, 30), label: `Warm +${pct(p, 30)}%`, prio: 16 });
  }
  if (/cool(er)?\b|colder|blue tone|icy/.test(p)) {
    push({ kind: "temperature", amount: -pct(p, 30), label: `Cool ${pct(p, 30)}%`, prio: 16 });
  }
  if (/black ?(and|&) ?white|grayscale|greyscale|b&w|monochrome|mono\b/.test(p)) {
    push({ kind: "grayscale", label: "Black & white", prio: 15 });
  }
  if (/sepia|vintage|retro|old ?photo|nostalgic/.test(p)) {
    push({ kind: "sepia", amount: /vintage|retro|old/.test(p) ? 70 : pct(p, 80), label: "Sepia tone", prio: 14 });
    if (/vintage|retro|old ?photo|film/.test(p)) push({ kind: "grain", amount: 18, label: "Film grain", prio: 9 });
  }
  if (/invert|negative/.test(p)) {
    push({ kind: "invert", label: "Invert colors", prio: 14 });
  }

  // --- Effects ---
  if (/cinematic|moody|film ?look|dramatic look/.test(p)) {
    push({ kind: "contrast", amount: 18, label: "Contrast +18%", prio: 18 });
    push({ kind: "saturation", amount: -10, label: "Saturation −10%", prio: 17 });
    push({ kind: "vignette", amount: 40, label: "Vignette", prio: 8 });
  }
  if (/vignette|dark(ened)? (edges|corners)|faded edges/.test(p)) {
    push({ kind: "vignette", amount: pct(p, 35), label: `Vignette ${pct(p, 35)}%`, prio: 8 });
  }
  if (/(add )?(film )?grain|grainy|analog/.test(p) && !/reduce|remove|less|denoise/.test(p)) {
    push({ kind: "grain", amount: pct(p, 20), label: `Film grain ${pct(p, 20)}%`, prio: 9 });
  }
  if (/sharpen|crisper|crisper|more detail|unsharp/.test(p) && !/upscale|enlarge|bigger/.test(p)) {
    push({ kind: "sharpen", amount: pct(p, 50), label: `Sharpen ${pct(p, 50)}%`, prio: 10 });
  }
  if (/denoise|reduce noise|noisy|noise reduction|clean up|smoothe?n out/.test(p)) {
    push({ kind: "denoise", amount: pct(p, 55), label: `Denoise ${pct(p, 55)}%`, prio: 11 });
  }
  if (/blur( the)? (whole )?(image|photo|picture)|blur it all/.test(p) && !/background/.test(p)) {
    push({ kind: "gaussian", amount: px(p, 8, 40), label: `Blur ${px(p, 8, 40)}px`, prio: 7 });
  }

  // --- Finishing ---
  if (/border|frame|polaroid/.test(p)) {
    const color = /black/.test(p) ? "#000000" : "#ffffff";
    const w = /polaroid/.test(p) ? Math.round(0.06 * 1600) : px(p, 24, 200);
    push({ kind: "border", width: w, color, label: `${color === "#000000" ? "Black" : "White"} border ${w}px`, prio: 5 });
  }
  if (/round(ed)? corners|rounded/.test(p)) {
    push({ kind: "rounded", radius: px(p, 32, 200), label: `Rounded corners ${px(p, 32, 200)}px`, prio: 4 });
  }

  // --- Output ---
  if (/compress|smaller file|reduce (file )?size|lighter|for (the )?web|faster|for email/.test(p)) {
    const q = /a lot|heavily|tiny|email/.test(p) ? 45 : 75;
    push({ kind: "compress", quality: q, label: `Compress (${q}% quality)`, prio: 1 });
  }
  if (/webp/.test(p)) {
    push({ kind: "convert", mime: "image/webp", ext: "webp", label: "Export WebP", prio: 0 });
  } else if (/\.?png|transparent png/.test(p) || removedBg) {
    push({ kind: "convert", mime: "image/png", ext: "png", label: "Export PNG", prio: 0 });
  } else if (/\.?jpe?g/.test(p)) {
    push({ kind: "convert", mime: "image/jpeg", ext: "jpg", label: "Export JPG", prio: 0 });
  }

  return ops.sort((a, b) => b.prio - a.prio || a.kind.localeCompare(b.kind));
}

export const EDIT_OPS_HELP = [
  "remove the background · blur the background (bokeh) · resize 1080×1350 · Instagram story · YouTube thumbnail · expand to 16:9 · crop to 1:1",
  "upscale 2×/4× · brighten 20% · darker · contrast +15 · more saturated · muted · warmer · cooler · black and white · sepia · invert",
  "auto-enhance / fix lighting · sharpen · denoise · film grain · vignette · cinematic · vintage · gaussian blur 8px",
  "white border · polaroid frame · rounded corners · compress · save as WebP/PNG/JPG · rotate · flip — combine freely with “and”/“then”",
];
