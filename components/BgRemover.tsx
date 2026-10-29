"use client";

import { useEffect, useState, useCallback } from "react";
import UploadZone, { LoadedFile } from "@/components/UploadZone";
import { Download, RotateCcw, Sparkles } from "lucide-react";

type Stage = "empty" | "ready" | "running" | "done";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

export default function BgRemover() {
  const [stage, setStage] = useState<Stage>("empty");
  const [image, setImage] = useState<LoadedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const key = sessionStorage.getItem("is_last_upload");
        if (!key) return;
        sessionStorage.removeItem("is_last_upload");
        const cache = await caches.open("is-uploads");
        const res = await cache.match(key);
        if (!res) return;
        const blob = await res.blob();
        const file = new File([blob], key.split("/").pop() || "upload.jpg", { type: blob.type || "image/jpeg" });
        const url = URL.createObjectURL(file);
        const probe = new Image();
        await new Promise((r, j) => { probe.onload = r; probe.onerror = j; probe.src = url; });
        setImage({ file, url, name: file.name, size: blob.size, width: probe.naturalWidth, height: probe.naturalHeight });
        setStage("ready");
      } catch {}
    })();
  }, []);

  const run = useCallback(async () => {
    if (!image) return;
    setError("");
    setResultUrl(null);
    setStage("running");
    setStatus("Starting AI segmentation…");
    setProgress(5);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(image.file, {
        progress: (key: string, current: number, total: number) => {
          const pct = total ? Math.round((current / total) * 100) : 0;
          if (key.startsWith("fetch")) {
            setStatus(`Downloading AI model (${pct}%)… first run only`);
            setProgress(Math.max(5, Math.min(60, pct * 0.6)));
          } else if (key.startsWith("compute")) {
            setStatus("Segmenting subject…");
            setProgress(70);
          }
        },
      });
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStage("done");
      try {
        const key = "is_history";
        const items = JSON.parse(localStorage.getItem(key) || "[]");
        items.unshift({ tool: "background-remover", detail: "Transparent PNG", name: image.name, size: blob.size, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(items.slice(0, 50)));
      } catch {}
    } catch (e) {
      console.error(e);
      setError("The AI model could not run in this browser. Try a recent version of Chrome, Edge, or Firefox on desktop.");
      setStage("ready");
    }
  }, [image]);

  function download() {
    if (!resultBlob) return;
    const a = document.createElement("a");
    a.href = resultUrl!;
    a.download = (image?.name || "photo").replace(/\.[^.]+$/, "") + "-cutout.png";
    a.click();
  }

  const busy = stage === "running";

  return (
    <div>
      {stage === "empty" && <UploadZone onFile={(f) => { setImage(f); setStage("ready"); }} hint="PNG · JPG · WEBP · best with clear subjects" />}

      {stage !== "empty" && image && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Original</p>
                <p className="font-semibold">{image.width} × {image.height}px</p>
              </div>
              <button onClick={() => { setStage("empty"); setImage(null); setResultUrl(null); }} className="btn-ghost !px-3 !py-1.5 text-xs"><RotateCcw size={14} /> New</button>
            </div>
            <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-[#1a1a1d] p-3">
              <img src={image.url} alt="Original photo" className="max-h-[320px] rounded-lg object-contain" />
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Result</p>
              <p className="font-semibold">{stage === "done" ? "Transparent PNG ready" : busy ? "Processing…" : "Ready when you are"}</p>
            </div>
            <div className="relative flex min-h-[280px] items-center justify-center rounded-xl p-3" style={{ backgroundImage: "linear-gradient(45deg,#26262a 25%,transparent 25%),linear-gradient(-45deg,#26262a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#26262a 75%),linear-gradient(-45deg,transparent 75%,#26262a 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0", backgroundColor: "#131315" }}>
              {busy && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#0a0a0b]/70 backdrop-blur-sm">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  <p className="text-sm text-zinc-300">{status}</p>
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#26262a]">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="max-w-xs text-center text-xs text-zinc-500">The first run downloads the AI model (~40 MB); it&apos;s cached for next time.</p>
                </div>
              )}
              {resultUrl ? (
                <img src={resultUrl} alt="Photo with background removed, shown on transparency checkerboard" className="max-h-[320px] rounded-lg object-contain" />
              ) : (
                !busy && <p className="text-sm text-muted">Press “Remove background” to run the AI.</p>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              {!resultUrl && (
                <button onClick={run} disabled={busy} className="btn-primary flex-1">
                  <Sparkles size={16} /> {busy ? "Working…" : "Remove background"}
                </button>
              )}
              {resultUrl && (
                <>
                  <button onClick={download} className="btn-primary flex-1"><Download size={16} /> Download PNG</button>
                  <button onClick={run} disabled={busy} className="btn-ghost">Re-run</button>
                </>
              )}
            </div>
            {resultBlob && <p className="mt-3 text-center text-xs text-zinc-500">{formatBytes(resultBlob.size)} · PNG with alpha</p>}
            {error && <p className="mt-3 text-center text-sm text-rose-400">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
