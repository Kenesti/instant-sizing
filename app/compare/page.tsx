import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaqSection, JsonLd, Breadcrumbs } from "@/components/Seo";
import { COMPETITORS } from "@/lib/competitors";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Insightsize vs the Competition: Photo Tool Comparisons (2026)",
  description: "Honest, fact-based comparisons of Insightsize against Canva, Picsart, Photoroom, Pixlr, VSCO, Snapseed, Pixelcut, and Instasize — features, pricing, free tiers, and verdicts.",
  openGraph: {
    title: "Insightsize vs the Competition: Photo Tool Comparisons (2026)",
    description: "Honest comparisons of Insightsize against Canva, Picsart, Photoroom and more — features, pricing, and which is better.",
    type: "website",
  },
};

const FAQS = [
  { q: "What is the best free Instasize alternative?", a: "For browser-based utility work, Insightsize — free resizing, compression, conversion, and 5 daily on-device AI background removals with no signup. Snapseed is the strongest free alternative if you edit on mobile and want manual controls." },
  { q: "Are these comparisons biased?", a: "We build Insightsize, so we flag where competitors genuinely win — Canva for design, Photoroom for product staging, Snapseed for RAW. Each verdict names the use case where the other tool is the better pick." },
  { q: "Which tool is best for resizing images for social media?", a: "A dedicated utility is fastest. Insightsize, Instasize, and Pixlr all handle it; Insightsize is the only one that's free, signup-free, and fully in-browser." },
];

export default function CompareHub() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Insightsize Comparison Hub",
        description: "Side-by-side comparisons of Insightsize with leading photo editing tools.",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://insightsize.app/" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://insightsize.app/compare" },
        ],
      }} />
      <Header />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Compare", href: "/compare" }]} />
      <main className="hero-glow">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="chip mb-4">Comparisons</span>
            <h1 className="text-4xl font-bold sm:text-5xl">Insightsize vs the competition</h1>
            <p className="mt-4 text-muted">
              Honest, side-by-side comparisons built on published pricing and features — including where competitors genuinely beat us.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {COMPETITORS.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="card group p-6 transition hover:border-violet-500/40 hover:shadow-[0_0_40px_-18px_rgba(139,92,246,0.5)]"
              >
                <h2 className="text-xl font-bold">Insightsize vs {c.name}</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-violet-300">{c.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 transition group-hover:gap-2">
                  Read the comparison <ChevronRight size={15} />
                </span>
              </Link>
            ))}
          </div>

          <div className="card mt-10 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-8 text-center ring-1 ring-violet-500/30">
            <h2 className="text-2xl font-bold">Skip the research — try it free</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Every Insightsize utility is free, signup-free, and runs privately in your browser. Judge for yourself in 30 seconds.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary">Sign up free</Link>
              <Link href="/resize" className="btn-ghost">Open the resizer</Link>
            </div>
          </div>
        </div>
      </main>
      <FaqSection faqs={FAQS} title="Comparison FAQ" />
      <Footer />
    </>
  );
}
