import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { PLATFORMS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Social Media Image Sizes 2026 — Every Platform Guide | Insightsize",
  description: "The current image sizes for Instagram, YouTube, TikTok, Facebook, and more — with exact pixel dimensions and one-click resizing for each preset.",
  openGraph: { title: "Social Media Image Sizes 2026 — Insightsize", description: "Current image sizes for every platform with exact pixels.", type: "website" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Social Media Image Size Guides",
        description: "Current image dimensions for major platforms.",
      }} />
      <Header />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Size guides", href: "/sizes" }]} />
      <main className="hero-glow">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="chip mb-4">Size guides</span>
            <h1 className="text-4xl font-bold sm:text-5xl">Every platform, every size</h1>
            <p className="mt-4 text-muted">Exact pixel dimensions for every major platform — each preset one click away in the resizer.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((p) => (
              <Link key={p.slug} href={`/sizes/${p.slug}`} className="card group p-5 transition hover:border-violet-500/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-extrabold text-white" style={{ background: p.color }}>
                    {p.name.slice(0, 1)}
                  </span>
                  <div>
                    <h2 className="font-bold text-white">{p.name}</h2>
                    <p className="text-xs text-zinc-500">{p.presets.length} sizes</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted">
                  {p.presets.slice(0, 3).map((x) => `${x.name}: ${x.w}×${x.h}`).join(" · ")}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-violet-300">View sizes →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
