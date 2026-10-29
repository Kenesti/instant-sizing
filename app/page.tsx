import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroUpload from "@/components/HeroUpload";
import { JsonLd } from "@/components/Seo";
import { PLATFORMS } from "@/lib/presets";
import {
  Scaling, Maximize2, Eraser, Sparkles, Repeat, Minimize2,
  Check, Star, ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Insightsize — AI Photo Editor & Free Image Tools for Creators",
  description: "Resize, compress, convert, remove backgrounds and expand photos for free in your browser. AI-powered image tools for online sellers and creators.",
  openGraph: {
    title: "Insightsize — AI Photo Editor & Free Image Tools for Creators",
    description: "Resize, compress, convert, remove backgrounds and expand photos for free in your browser.",
    type: "website",
    url: "/",
  },
};

const TOOLS = [
  { icon: Scaling, n: "Image Resizer", d: "Resize to any platform preset or exact pixel dimensions with fit, fill, and stretch modes.", href: "/resize", cta: "Resize your photo" },
  { icon: Minimize2, n: "Image Compressor", d: "Shrink file sizes with a quality slider and live preview — perfect for faster stores.", href: "/compress", cta: "Compress image" },
  { icon: Repeat, n: "Image Converter", d: "Convert between PNG, JPG, and WebP without leaving your browser tab.", href: "/convert", cta: "Convert image" },
  { icon: Eraser, n: "Background Remover", d: "Real AI segmentation isolates your subject in seconds. Export transparent PNGs.", href: "/background-remover", cta: "Remove background" },
  { icon: Maximize2, n: "AI Image Expand", d: "Extend photos beyond their borders with AI-generated surroundings.", href: "/expand", cta: "Expand image" },
  { icon: Sparkles, n: "AI Upscaler", d: "Increase resolution up to 4× while keeping edges crisp.", href: "/upscale", cta: "Upscale image" },
];

const PLANS = [
  { n: "Free", p: "$0", sub: "Free forever", pop: false, cta: "Start for free", href: "/signup", f: ["Resizer, compressor, converter", "Background remover (5/day)", "HD JPG & PNG export", "Platform presets"] },
  { n: "Pro", p: "$9/mo", sub: "Billed monthly", pop: true, cta: "Start free trial", href: "/signup?plan=pro", f: ["Unlimited background removal", "AI expand & 4× upscaler", "Batch tools, 200 photos at a time", "Priority AI models"] },
  { n: "Studio", p: "$24/mo", sub: "Billed monthly", pop: false, cta: "Start free trial", href: "/signup?plan=studio", f: ["Everything in Pro", "8× upscale & video models", "Team library & brand kit", "Priority support"] },
];

const REVIEWS = [
  { t: "One of my go-to tools", b: "Perfect sizes for every platform. I resize all my shop photos here now — the presets just work.", h: "B", a: "@beachybunny" },
  { t: "Fast and straightforward", b: "Resizing photos for social media should be a cinch. Of the dozen tools I've used, this is the fastest and most consistent.", h: "S", a: "@sohobrad" },
  { t: "Great sizes", b: "Love the premade options for each platform. I use it daily for posts and Stories.", h: "N", a: "@nicolabella" },
  { t: "Saved my product listings", b: "Removed backgrounds from 40 product photos in one sitting. Clean transparent PNGs every time.", h: "T", a: "@theflywire" },
  { t: "Can't work without it", b: "I use it every day to resize images for all my social platforms.", h: "L", a: "@leobaby96" },
  { t: "Huge fan", b: "Makes every photo fit perfectly, on any platform, in seconds.", h: "J", a: "@jaytown" },
];

const FAQ = [
  { q: "What is Insightsize?", a: "Insightsize is a browser-based photo toolkit for online sellers and creators. Resize, compress, convert, remove backgrounds, expand, and upscale images — all free to start, all processed privately in your browser." },
  { q: "Is Insightsize really free?", a: "Yes. The resizer, compressor, converter and 5 daily background removals are free forever. Pro adds unlimited AI tools and batch processing, starting with a free trial." },
  { q: "Do my photos get uploaded to a server?", a: "No. Every tool runs client-side in your browser — resize, compress, convert, and even the AI background removal model. Your photos never leave your device." },
  { q: "Which formats are supported?", a: "JPG, PNG, and WebP inputs up to 10 MB. The resizer exports JPG, the converter handles PNG/JPG/WebP, and the background remover exports transparent PNGs." },
  { q: "How do I resize images for social media?", a: "Open the Image Resizer, pick a platform preset (Instagram, YouTube, TikTok, and more), choose fit or fill, and download. Dimensions match each platform's published requirements." },
  { q: "Do I need to install anything?", a: "No. Insightsize works entirely in your web browser on desktop and mobile." },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Insightsize",
        url: "https://insightsize.app",
        description: "Free browser-based image tools: resize, compress, convert, remove backgrounds with AI, expand and upscale photos.",
        potentialAction: { "@type": "SearchAction", target: "https://insightsize.app/sizes?q={query}", "query-input": "required name=query" },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-glow relative">
          <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
            <span className="chip mb-6">✦ AI photo tools · web & mobile</span>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] sm:text-6xl">
              AI Photo Editor<br />for <span className="gradient-text">Creators</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Insightsize is a photo toolkit for online sellers and creators. Resize and compress for free;
              remove backgrounds and expand photos with AI plans that start with a free trial.
            </p>
            <div className="mx-auto mt-9 max-w-xl">
              <HeroUpload />
            </div>
            <p className="mt-5 text-xs text-zinc-500">
              Just need to resize?{" "}
              <Link href="/resize" className="text-violet-300 underline-offset-2 hover:underline">Open the free image resizer</Link>
              {" · "}<Link href="/sizes/instagram" className="text-violet-300 underline-offset-2 hover:underline">Instagram sizes</Link>
              {" · "}<Link href="/sizes/youtube" className="text-violet-300 underline-offset-2 hover:underline">YouTube sizes</Link>
            </p>
          </div>
        </section>

        {/* Platform strip */}
        <section className="border-y border-[#26262a] bg-[#0d0d0f] py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Resize for</span>
            {PLATFORMS.slice(0, 8).map((p) => (
              <Link key={p.slug} href={`/sizes/${p.slug}`} className="text-sm font-medium text-zinc-400 transition hover:text-white">{p.name}</Link>
            ))}
            <Link href="/sizes" className="text-sm font-medium text-violet-300 hover:text-violet-200">All sizes →</Link>
          </div>
        </section>

        {/* Tools */}
        <section className="section" aria-labelledby="tools-h">
          <div className="section-head">
            <span className="chip mb-4">Free tools</span>
            <h2 id="tools-h" className="text-3xl font-bold sm:text-4xl">Every tool you need to ship photos</h2>
            <p className="mt-3 text-muted">Six focused tools that run 100% in your browser. No uploads, no watermarks, no signup for the basics.</p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <article key={t.n} className="card group p-6 transition hover:border-violet-500/40 hover:shadow-[0_0_40px_-18px_rgba(139,92,246,0.5)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25">
                  <t.icon size={22} />
                </div>
                <h3 className="text-lg font-bold">{t.n}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.d}</p>
                <Link href={t.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 transition group-hover:gap-2">{t.cta} <ChevronRight size={15} /></Link>
              </article>
            ))}
          </div>
        </section>

        {/* Compare funnel entry */}
        <section className="section border-y border-[#26262a] bg-[#0d0d0f]" aria-labelledby="compare-h">
          <div className="section-head">
            <span className="chip mb-4">Comparisons</span>
            <h2 id="compare-h" className="text-3xl font-bold sm:text-4xl">Weighing up your options?</h2>
            <p className="mt-3 text-muted">Honest, fact-based comparisons between Insightsize and the tools you&apos;re already considering.</p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {[
              { t: "Insightsize vs Instasize", d: "How our free browser toolkit stacks up against the original mobile-first editor.", h: "/compare/instasize" },
              { t: "Insightsize vs Canva", d: "Resizing without per-use credits or a design-suite learning curve.", h: "/compare/canva" },
              { t: "All comparisons", d: "Canva, Picsart, Photoroom, Pixlr, VSCO, Snapseed and more.", h: "/compare" },
            ].map((c) => (
              <Link key={c.h} href={c.h} className="card-2 group p-6 transition hover:border-violet-500/40">
                <h3 className="font-bold text-white">{c.t}</h3>
                <p className="mt-2 text-sm text-muted">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 transition group-hover:gap-2">Read comparison <ChevronRight size={15} /></span>
              </Link>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="section" aria-labelledby="pricing-h">
          <div className="section-head">
            <h2 id="pricing-h" className="text-3xl font-bold sm:text-4xl">Pricing: free tools, paid AI</h2>
            <p className="mt-3 text-muted">Resize, compress, and convert free. Paid plans unlock unlimited AI and batch tools with a free trial.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 pt-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <article key={p.n} className={`card relative p-7 ${p.pop ? "ring-2 ring-violet-500" : ""}`}>
                {p.pop && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Popular</span>}
                <h3 className="text-lg font-bold">{p.n}</h3>
                <p className="mt-1 text-sm text-muted">{p.n === "Free" ? "Essential tools for casual creators." : p.n === "Pro" ? "Unlimited AI for serious creators." : "Advanced power for professionals."}</p>
                <p className="mt-5 text-4xl font-extrabold">{p.p}</p>
                <p className="mt-1 text-xs text-zinc-500">{p.sub}</p>
                <Link href={p.href} className={`mt-6 w-full ${p.pop ? "btn-primary" : "btn-ghost"}`}>{p.cta}</Link>
                <ul className="mt-6 space-y-2.5">
                  {p.f.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300"><Check size={15} className="mt-0.5 shrink-0 text-emerald-400" /> {f}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-zinc-500">
            Paid plans renew automatically until you cancel. Insightsize is a demo product for educational purposes; features and pricing on this site are illustrative.
          </p>
        </section>

        {/* Reviews */}
        <section className="section border-t border-[#26262a] bg-[#0d0d0f]" aria-labelledby="reviews-h">
          <div className="section-head">
            <span className="chip mb-4">Reviews</span>
            <h2 id="reviews-h" className="text-3xl font-bold sm:text-4xl">Loved by creators</h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-3xl font-extrabold">4.7</span>
              <div className="text-left">
                <div className="flex gap-0.5 text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                <p className="mt-1 text-xs text-zinc-500">2,400+ creator reviews</p>
              </div>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.a + r.t} className="card-2 p-6">
                <div className="mb-3 flex gap-0.5 text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                <h3 className="font-semibold text-white">{r.t}</h3>
                <blockquote className="mt-2 text-sm leading-relaxed text-muted">&ldquo;{r.b}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">{r.h}</span>
                  <span className="text-xs text-zinc-400">{r.a}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section" aria-labelledby="faq-h">
          <div className="section-head">
            <h2 id="faq-h" className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="cursor-pointer list-none font-semibold text-white flex items-center justify-between">
                  {f.q}
                  <span className="text-violet-400 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section border-t border-[#26262a]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to resize anything?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">Create a free account to save your history, keep your presets, and track your AI credits.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary">Sign up free</Link>
              <Link href="/resize" className="btn-ghost">Try the resizer first</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
