import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumbs, JsonLd, FaqSection } from "@/components/Seo";
import { PLATFORMS } from "@/lib/presets";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PLATFORMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PLATFORMS.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.name} Image Sizes 2026 — Exact Pixel Dimensions | Insightsize`;
  const description = `The current ${p.name} image sizes: posts, stories, profiles, banners and more — exact pixel dimensions for every format, with one-click resizing.`;
  return {
    title,
    description,
    alternates: { canonical: `/sizes/${p.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function SizePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = PLATFORMS.find((x) => x.slug === slug);
  if (!p) notFound();

  const faqs = [
    { q: `What is the best image size for ${p.name}?`, a: `It depends on the placement. ${p.presets[0].name} is ${p.presets[0].w}×${p.presets[0].h}px, but each format has its own ideal dimensions — the table above lists all ${p.presets.length} current presets.` },
    { q: `Can I resize an image to a ${p.name} size for free?`, a: `Yes. Open the free Insightsize resizer, pick the ${p.name} preset, and download. It runs entirely in your browser with no signup.` },
    { q: `Do these sizes change?`, a: `Platforms update their requirements occasionally. We track the published specs and update this guide when they change.` },
  ];

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to resize images for ${p.name}`,
        step: [
          { "@type": "HowToStep", name: "Upload", text: "Open the Insightsize resizer and drop your photo in." },
          { "@type": "HowToStep", name: "Pick a preset", text: `Select a ${p.name} preset for the placement you need.` },
          { "@type": "HowToStep", name: "Download", text: "Choose fit or fill and download the result." },
        ],
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://insightsize.app/" },
          { "@type": "ListItem", position: 2, name: "Size guides", item: "https://insightsize.app/sizes" },
          { "@type": "ListItem", position: 3, name: p.name, item: `https://insightsize.app/sizes/${p.slug}` },
        ],
      }} />
      <Header />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Size guides", href: "/sizes" }, { name: p.name, href: `/sizes/${p.slug}` }]} />
      <main className="hero-glow">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <span className="chip mb-4">Size guide</span>
          <h1 className="text-3xl font-bold sm:text-5xl">{p.name} image sizes in 2026</h1>
          <p className="mt-4 text-muted">
            The current {p.name} image dimensions for every format — {p.presets.length} presets with exact pixels. Each one is a single click in the free resizer.
          </p>

          <div className="card mt-8 overflow-x-auto">
            <table className="cmp">
              <thead>
                <tr><th>Format</th><th>Dimensions</th><th>Resize</th></tr>
              </thead>
              <tbody>
                {p.presets.map((x) => (
                  <tr key={x.name}>
                    <td className="font-medium text-white">{x.name}</td>
                    <td className="text-zinc-300">{x.w} × {x.h} px</td>
                    <td><Link href="/resize" className="text-violet-300 hover:underline">Resize →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card mt-8 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-7 text-center ring-1 ring-violet-500/30">
            <h2 className="!m-0 text-xl font-bold">Resize for {p.name} free</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">No signup. No upload. Runs on your device.</p>
            <Link href="/resize" className="btn-primary mt-4 inline-flex">Open the resizer</Link>
          </div>

          <h2 className="!mt-10 text-2xl font-bold">Other platforms</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {PLATFORMS.filter((x) => x.slug !== p.slug).map((x) => (
              <Link key={x.slug} href={`/sizes/${x.slug}`} className="btn-ghost !py-2 !px-4 text-sm">{x.name}</Link>
            ))}
          </div>
        </div>
      </main>
      <FaqSection faqs={faqs} title={`${p.name} sizes FAQ`} />
      <Footer />
    </>
  );
}
