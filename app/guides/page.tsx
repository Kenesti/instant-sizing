import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Photo Guides for Sellers & Creators | Insightsize",
  description: "Practical guides on sizing, compressing, and preparing photos for social platforms and marketplaces.",
  openGraph: { title: "Photo Guides — Insightsize", description: "Practical photo guides for sellers and creators.", type: "website" },
};

const GUIDES = [
  { t: "How to resize images for Instagram in 2026", d: "Every Instagram format explained: feed posts, Stories, Reels, and profile photos — with the exact dimensions that avoid quality loss.", href: "/sizes/instagram", tag: "Instagram" },
  { t: "Product photography for Etsy and Shopify", d: "Background removal, exact listing sizes, and compression — the three-step pipeline for marketplace-ready photos.", href: "/sizes/etsy", tag: "E-commerce" },
  { t: "Why your photos look blurry (and how to fix them)", d: "The common causes — wrong dimensions, over-compression, platform re-encoding — and how each tool fixes them.", href: "/upscale", tag: "Quality" },
  { t: "Compress images without visible quality loss", d: "How JPG and WebP encoding works, and how to pick the quality level that halves file size with no visible difference.", href: "/compress", tag: "Performance" },
  { t: "YouTube thumbnails that get clicked", d: "The 1280×720 spec, safe zones, and how contrast drives click-through.", href: "/sizes/youtube", tag: "YouTube" },
  { t: "Cutting out products for clean listing photos", d: "When to use background removal, and how transparent PNGs convert better on marketplaces.", href: "/background-remover", tag: "E-commerce" },
];

export default function Page() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }]} />
      <main className="hero-glow">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="chip mb-4">Guides</span>
            <h1 className="text-4xl font-bold sm:text-5xl">Practical photo guides</h1>
            <p className="mt-4 text-muted">Short, useful guides on getting photos right for every platform — no fluff.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <Link key={g.t} href={g.href} className="card group flex flex-col p-6 transition hover:border-violet-500/40">
                <span className="chip mb-3 self-start">{g.tag}</span>
                <h2 className="text-lg font-bold leading-snug">{g.t}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.d}</p>
                <span className="mt-4 text-sm font-semibold text-violet-300">Read guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
