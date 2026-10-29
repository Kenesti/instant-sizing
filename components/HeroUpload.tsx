"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

const TOOLS = [
  { name: "Background Remover", href: "/background-remover" },
  { name: "Image Resizer", href: "/resize" },
  { name: "AI Image Expand", href: "/expand" },
  { name: "AI Upscaler", href: "/upscale" },
];

export default function HeroUpload() {
  const router = useRouter();
  const [drag, setDrag] = useState(false);
  void drag;
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      if ("caches" in window) {
        const cache = await caches.open("is-uploads");
        const key = "/__upload/" + Date.now() + "-" + file.name;
        await cache.put(key, new Response(file, { headers: { "Content-Type": file.type || "image/jpeg" } }));
        sessionStorage.setItem("is_last_upload", key);
      }
      router.push("/background-remover");
    } catch {
      router.push("/background-remover");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        className="dropzone flex cursor-pointer flex-col items-center justify-center bg-[#131315]/80 px-6 py-10 text-center backdrop-blur-sm"
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload a photo to start editing"
      >
        <UploadCloud className="mb-3 text-violet-400" size={32} />
        <p className="font-semibold">{busy ? "Opening editor…" : "Upload a photo"}</p>
        <p className="mt-1 text-sm text-muted">or drag and drop</p>
        <p className="mt-3 text-xs text-zinc-500">PNG · JPG · WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Opens in{" "}
        {TOOLS.map((t, i) => (
          <span key={t.href}>
            <a href={t.href} className="text-violet-300 underline-offset-2 hover:underline">{t.name}</a>
            {i < TOOLS.length - 1 && " · "}
          </span>
        ))}
      </p>
    </div>
  );
}
