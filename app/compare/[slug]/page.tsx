import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaqSection, JsonLd, Breadcrumbs } from "@/components/Seo";
import { COMPETITORS } from "@/lib/competitors";
import { Check, X, Minus, ChevronRight } from "lucide-react";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPETITORS.find((x) => x.slug === slug);
  if (!c) return {};
  const title = `Insightsize vs ${c.name}: Features, Pricing & Which Is Better in 2026`;
  const description = `Insightsize vs ${c.name} compared on features, pricing, free options, speed, and ease of use — plus an honest verdict on which is better for your use case.`;
  return {
    title,
    description,
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/compare/${c.slug}`,
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = COMPETITORS.find((x) => x.slug === slug);
  if (!c) notFound();

  const others = COMPETITORS.filter((x) => x.slug !== c.slug).slice(0, 4);
  const usWins = c.rows.filter((r) => r.win === "us").length;
  const themWins = c.rows.filter((r) => r.win === "them").length;

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Insightsize",
        description: "Free browser-based image tools: resize, compress, convert, AI background removal, expand, upscale.",
        brand: { "@type": "Brand", name: "Insightsize" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
        review: { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: "4.7", bestRating: "5" }, author: { "@type": "Organization", name: "Insightsize users" } },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://insightsize.app/" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://insightsize.app/compare" },
          { "@type": "ListItem", position: 3, name: `vs ${c.name}`, item: `https://insightsize.app/compare/${c.slug}` },
        ],
      }} />
      <Header />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Compare", href: "/compare" }, { name: `vs ${c.name}`, href: `/compare/${c.slug}` }]} />
      <main className="hero-glow prose-page">
        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <span className="chip mb-4">Comparison</span>
          <h1 className="!text-3xl font-bold sm:!text-5xl">
            Insightsize vs {c.name}: features, pricing, and which is better in 2026
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{c.intro}</p>

          <div className="card mt-8 p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="!m-0 text-base font-bold text-violet-300">Insightsize</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  <li>💰 {c.rows.find((r) => r.feature === "Price to start")?.us ?? "Free, no card"}</li>
                  <li>🔒 100% private, in-browser processing</li>
                  <li>⚡ Instant utility tools — no signup</li>
                </ul>
              </div>
              <div>
                <h2 className="!m-0 text-base font-bold text-cyan-300">{c.name}</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  <li>💰 {c.pricing}</li>
                  <li>🎯 Best for: {c.bestFor}</li>
                  <li>📱 {c.platforms}</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 border-t border-[#26262a] pt-5 text-center">
              <div>
                <p className="text-2xl font-extrabold text-violet-300">{usWins}</p>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Insightsize wins</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-zinc-400">{c.rows.length - usWins - themWins}</p>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Tied</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-cyan-300">{themWins}</p>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">{c.name} wins</p>
              </div>
            </div>
          </div>

          <h2 className="!text-2xl">Side-by-side comparison</h2>
          <div className="card mt-4 overflow-x-auto">
            <table className="cmp">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Insightsize</th>
                  <th>{c.name}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.feature}>
                    <td className="font-medium text-white">{r.feature}</td>
                    <td className={r.win === "us" ? "text-emerald-300" : "text-zinc-300"}>
                      {r.win === "us" ? <Check size={13} className="mr-1.5 inline" /> : r.win === "them" ? <Minus size={13} className="mr-1.5 inline text-zinc-500" /> : null}
                      {r.us}
                    </td>
                    <td className={r.win === "them" ? "text-emerald-300" : "text-zinc-300"}>
                      {r.win === "them" ? <Check size={13} className="mr-1.5 inline" /> : r.win === "us" ? <Minus size={13} className="mr-1.5 inline text-zinc-500" /> : null}
                      {r.them}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="font-medium text-white">Speed</td>
                  <td className="text-zinc-300">Instant — runs locally</td>
                  <td className="text-zinc-300">{c.speed}</td>
                </tr>
                <tr>
                  <td className="font-medium text-white">Ease of use</td>
                  <td className="text-zinc-300">One page per tool, zero learning curve</td>
                  <td className="text-zinc-300">{c.easeOfUse}</td>
                </tr>
                <tr>
                  <td className="font-medium text-white">Free option</td>
                  <td className="text-zinc-300">Full utility toolkit free, 5 AI runs/day</td>
                  <td className="text-zinc-300">{c.freeOption}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="card-2 p-6">
              <h3 className="!m-0 text-base font-bold text-emerald-400">✓ Insightsize pros</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>Free forever core toolkit — no card, no signup</li>
                <li>Fully private: processing happens on your device</li>
                <li>Instant: each tool is one page, no app to load</li>
                <li>Exact pixel presets for 13+ platforms</li>
              </ul>
            </div>
            <div className="card-2 p-6">
              <h3 className="!m-0 text-base font-bold text-rose-400">✗ Insightsize cons</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>No layer-based editing or design composition</li>
                <li>No native mobile apps (responsive web only)</li>
                <li>Smaller preset library than long-established rivals</li>
                <li>Batch processing gated behind Pro</li>
              </ul>
            </div>
            <div className="card-2 p-6">
              <h3 className="!m-0 text-base font-bold text-emerald-400">✓ {c.name} pros</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {c.pros.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="card-2 p-6">
              <h3 className="!m-0 text-base font-bold text-rose-400">✗ {c.name} cons</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {c.cons.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="!text-2xl">Verdict: which should you choose?</h2>
          <p>{c.verdict}</p>

          <div className="card mt-8 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-7 text-center ring-1 ring-violet-500/30">
            <h3 className="!m-0 text-xl font-bold">Try Insightsize free — decide in 30 seconds</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Resize, compress, convert, or cut out a background right now. No signup, no upload, runs on your device.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary">Sign up free</Link>
              <Link href="/background-remover" className="btn-ghost">Try the background remover</Link>
            </div>
          </div>

          <h2 className="!text-2xl">More comparisons</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <Link key={o.slug} href={`/compare/${o.slug}`} className="card group flex items-center justify-between p-4 transition hover:border-violet-500/40">
                <span className="text-sm font-medium">Insightsize vs {o.name}</span>
                <ChevronRight size={16} className="text-violet-300 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </article>
      </main>
      <FaqSection faqs={c.faqs} title={`${c.name} vs Insightsize FAQ`} />
      <Footer />
    </>
  );
}
