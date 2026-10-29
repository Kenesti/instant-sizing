import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { Scaling, Minimize2, Repeat, Eraser, Sparkles, Maximize2, Wand2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "All Free Image Tools — Resize, Compress, Convert & More | Insightsize",
  description: "Explore every free Insightsize tool: image resizer, compressor, converter, AI background remover, AI image expand, and AI upscaler.",
  openGraph: { title: "All Free Image Tools — Insightsize", description: "Explore every free Insightsize tool.", type: "website" },
};

const TOOLS = [
  { icon: Wand2, n: "AI Photo Editor", d: "Describe your edit in plain English — the AI plans and runs every step in your browser.", href: "/ai-editor" },
  { icon: Scaling, n: "Image Resizer", d: "Resize to any platform preset or exact pixels with fit, fill, and stretch modes.", href: "/resize" },
  { icon: Minimize2, n: "Image Compressor", d: "Shrink file sizes with a live quality slider and instant preview.", href: "/compress" },
  { icon: Repeat, n: "Image Converter", d: "Convert between PNG, JPG, and WebP without leaving your browser.", href: "/convert" },
  { icon: Eraser, n: "AI Background Remover", d: "Real on-device AI segmentation with transparent PNG export.", href: "/background-remover" },
  { icon: Maximize2, n: "AI Image Expand", d: "Extend photos to any aspect ratio without cropping.", href: "/expand" },
  { icon: Sparkles, n: "AI Upscaler", d: "Enlarge photos up to 4× with multi-pass enhancement.", href: "/upscale" },
];

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Insightsize Free Image Tools",
        itemListElement: TOOLS.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.n,
          url: `https://insightsize.app${t.href}`,
        })),
      }} />
      <Header />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }]} />
      <main className="hero-glow">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="chip mb-4">Free tools</span>
            <h1 className="text-4xl font-bold sm:text-5xl">Every tool, one job each</h1>
            <p className="mt-4 text-muted">Six focused tools that run 100% in your browser. No uploads, no watermarks, no signup for the basics.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="card group p-6 transition hover:border-violet-500/40 hover:shadow-[0_0_40px_-18px_rgba(139,92,246,0.5)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25">
                  <t.icon size={22} />
                </div>
                <h2 className="text-lg font-bold">{t.n}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 transition group-hover:gap-2">Open tool <ChevronRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
