import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let transformSync;
for (const p of ["esbuild", "/tmp/audit/node_modules/esbuild", "../node_modules/esbuild"]) {
  try { transformSync = require(p).transformSync; break; } catch {}
}
if (!transformSync) {
  console.error("esbuild not found — run: npm install --no-save esbuild");
  process.exit(1);
}

let js = transformSync(readFileSync(new URL("../lib/aiTransform.ts", import.meta.url), "utf8"), {
  loader: "ts",
  format: "cjs",
}).code;
js = js.replace(/.*@huggingface\/transformers.*/g, "");
js = js.replace(/export function getDetector[\s\S]*?^}/m, "");
js = js.replace(/export async function detectObjects[\s\S]*?^}/m, "");

const mod = { exports: {} };
new Function("module", "exports", js)(mod, mod.exports);
const { selectDetection } = mod.exports;

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

// Unambiguous scene: left person (smaller, higher), right person (larger, lower), big car.
// areas: left 140*200=28000, right 100*220=22000 → right person is smaller.
const dets = [
  { label: "person", score: 0.9, box: [10, 50, 150, 250] },   // left, cy=150 (top)
  { label: "person", score: 0.8, box: [400, 300, 500, 520] }, // right, cy=410 (bottom)
  { label: "car", score: 0.7, box: [200, 350, 700, 550] },    // 500*200=100000 (largest)
];
const W = 800, H = 600;
const sel = (o, s) => selectDetection(dets, W, H, { kind: "object", object: o, spatial: s });

t("left side picks leftmost by center-x", () => eq(sel("man", "left").box, dets[0].box));
t("right side picks rightmost by center-x", () => eq(sel("person", "right").box, dets[1].box));
t("top picks highest center-y", () => eq(sel("person", "top").box, dets[0].box));
t("bottom picks lowest center-y", () => eq(sel("person", "bottom").box, dets[1].box));
t("largest picks biggest area", () => eq(sel("car", "largest").box, dets[2].box));
t("smallest person picks the smaller instance", () => eq(sel("person", "smallest").box, dets[1].box));
t("default (no spatial) picks largest match", () => eq(sel("person", undefined).box, dets[0].box));
t("synonym: man → person class", () => eq(sel("man", "left").label, "person"));
t("synonym: woman → person class", () => eq(sel("woman", "left").label, "person"));
t("unknown object falls back to whole pool", () => eq(sel("spaceship", "left") !== null, true));
t("empty detections returns null", () => eq(selectDetection([], W, H, { kind: "object", object: "man" }), null));
t("foreground maps to largest", () => eq(sel("person", "foreground").box, dets[0].box));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
