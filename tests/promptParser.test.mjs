import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const esbuildPaths = [
  "esbuild",
  "/tmp/audit/node_modules/esbuild",
  "../node_modules/esbuild",
];
let transformSync;
for (const p of esbuildPaths) {
  try { transformSync = require(p).transformSync; break; } catch {}
}
if (!transformSync) {
  console.error("esbuild not found — run: npm install --no-save esbuild");
  process.exit(1);
}

const src = readFileSync(new URL("../lib/promptParser.ts", import.meta.url), "utf8");
const js = transformSync(src, { loader: "ts", format: "cjs" }).code;
const mod = { exports: {} };
new Function("module", "exports", js)(mod, mod.exports);
const { parsePrompt, EDIT_OPS_HELP } = mod.exports;

const kinds = (p) => parsePrompt(p).map((o) => o.kind);
const find = (p, k) => parsePrompt(p).find((o) => o.kind === k);

let pass = 0;
let fail = 0;
function t(name, fn) {
  try { fn(); pass++; } catch (e) { fail++; console.log("  ❌ " + name + " → " + e.message); }
}
function eq(actual, expected, msg) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error((msg || "") + " got " + JSON.stringify(actual) + " want " + JSON.stringify(expected));
  }
}

// --- understanding real language ---
t("plain background removal", () => eq(kinds("remove the background"), ["remove-bg", "convert"]));
t("transparent cutout phrasing", () => eq(kinds("cut out the subject so the background is transparent"), ["remove-bg", "convert"]));
t("isolate synonym", () => eq(kinds("isolate the product"), ["remove-bg", "convert"]));

t("bokeh / portrait mode", () => eq(kinds("portrait mode"), ["blur-bg"]));
t("blur the background", () => eq(kinds("blur the background"), ["blur-bg"]));
t("soften background", () => eq(kinds("soften the background"), ["blur-bg"]));
t("blur strength px", () => eq(find("blur the background 25px", "blur-bg").strength, 25));
t("blur with adverb", () => eq(find("heavily blur the background", "blur-bg").strength, 27));

t("brighten with percent", () => eq(find("brighten 30%", "brightness").amount, 30));
t("slightly brighter", () => eq(find("slightly brighter", "brightness").amount, 8));
t("much brighter", () => eq(find("much brighter", "brightness").amount, 26));
t("darker", () => eq(find("make it darker", "brightness").amount < 0, true));

t("contrast", () => eq(find("more contrast", "contrast").amount, 15));
t("punchy/dramatic contrast", () => eq(find("make it dramatic", "contrast").amount, 15));
t("saturation vivid", () => eq(find("more vivid colors", "saturation").amount, 20));
t("desaturate is negative", () => eq(find("desaturate it", "saturation").amount < 0, true));
t("muted colors", () => eq(find("muted colors", "saturation").amount < 0, true));
t("warmer", () => eq(find("warmer tone", "temperature").amount > 0, true));
t("cooler", () => eq(find("cooler tone", "temperature").amount < 0, true));
t("golden sunset tone", () => eq(find("golden sunset tone", "temperature").amount > 0, true));

t("b&w phrasings", () => {
  eq(kinds("black and white"), ["grayscale"]);
  eq(kinds("b&w"), ["grayscale"]);
  eq(kinds("monochrome"), ["grayscale"]);
});
t("vintage preset chains", () => {
  const k = kinds("vintage photo look");
  eq(k.includes("sepia"), true);
  eq(k.includes("grain"), true);
});
t("cinematic preset chains", () => {
  const k = kinds("cinematic look");
  eq(k.includes("contrast"), true);
  eq(k.includes("saturation"), true);
  eq(k.includes("vignette"), true);
});
t("auto-enhance phrasings", () => {
  eq(kinds("auto-enhance").includes("auto-enhance"), true);
  eq(kinds("make it pop").includes("auto-enhance"), true);
  eq(kinds("fix the lighting").includes("auto-enhance"), true);
});
t("sharpen", () => eq(kinds("sharpen it"), ["sharpen"]));
t("crisper synonym", () => eq(kinds("make it crisper").includes("sharpen"), true));
t("denoise", () => eq(kinds("reduce noise"), ["denoise"]));
t("film grain", () => eq(kinds("add film grain").includes("grain"), true));
t("vignette", () => eq(kinds("add a vignette"), ["vignette"]));
t("whole-image blur", () => eq(find("blur the image 8px", "gaussian").amount, 8));
t("invert", () => eq(kinds("invert the colors"), ["invert"]));

// --- geometry ---
t("instagram post", () => eq(find("instagram", "resize").w, 1080));
t("instagram story", () => eq(find("instagram story", "resize").w, 1080));
t("instagram story height", () => eq(find("instagram story", "resize").h, 1920));
t("youtube", () => eq(find("youtube", "resize").w, 1280));
t("tiktok", () => eq(find("tiktok", "resize").h, 1920));
t("custom dims with ×", () => eq(find("800 × 600", "resize").w, 800));
t("custom dims with x", () => eq(find("800x600", "resize").w, 800));
t("custom dims with by", () => eq(find("800 by 600", "resize").w, 800));
t("square", () => eq(find("square", "resize").w, 1080));
t("crop to ratio", () => eq(kinds("crop to 1:1").includes("crop-ratio"), true));
t("no-crop fit mode", () => {
  const r = find("resize to 1000 × 1000 without cropping", "resize");
  eq(r.fit, true);
});
t("black bars background", () => {
  const r = find("resize to 1000 × 1000 with black bars", "resize");
  eq(r.bg, "#000000");
});
t("rotate left", () => eq(find("rotate left", "rotate").deg, -90));
t("rotate 180", () => eq(find("rotate 180", "rotate").deg, 180));
t("flip horizontal / mirror", () => eq(find("mirror it", "flip").axis, "x"));
t("flip vertical", () => eq(find("flip vertically", "flip").axis, "y"));
t("upscale 2x", () => eq(find("upscale", "upscale").scale, 2));
t("upscale 4x", () => eq(find("upscale 4x", "upscale").scale, 4));
t("8k upscale", () => eq(find("make it 8k", "upscale").scale, 4));

// --- finishing & output ---
t("border", () => eq(kinds("add a white border").includes("border"), true));
t("black border color", () => eq(find("black border", "border").color, "#000000"));
t("polaroid", () => eq(kinds("polaroid").includes("border"), true));
t("rounded corners", () => eq(kinds("rounded corners").includes("rounded"), true));
t("compress", () => eq(find("compress it", "compress").quality, 75));
t("heavy compress", () => eq(find("compress heavily", "compress").quality, 45));
t("webp", () => eq(kinds("save as webp").includes("convert"), true));
t("png", () => eq(find("save as png", "convert").ext, "png"));
t("jpg", () => eq(find("save as jpg", "convert").ext, "jpg"));

// --- combos & ordering ---
t("multi-op combo runs in priority order (segment → geometry → tone → export last)", () => {
  const k = kinds("remove the background, brighten 20%, resize to 1080 × 1350 for instagram, and save as png");
  eq(k, ["remove-bg", "resize", "brightness", "convert"]);
});
t("unrecognized prompt returns empty", () => eq(kinds("hello world"), []));
t("dedup: no repeated ops", () => {
  const k = kinds("remove the background then remove the background");
  eq(k.filter((x) => x === "remove-bg").length, 1);
});

t("EDIT_OPS_HELP reference ships all op families", () => {
  const joined = EDIT_OPS_HELP.join(" ").toLowerCase();
  for (const probe of ["remove the background", "upscale", "vignette", "webp", "polaroid", "denoise"])
    eq(joined.includes(probe), true, "missing " + probe);
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
