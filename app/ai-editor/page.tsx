import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import AiEditorClient from "@/components/AiEditorClient";
import { FaqSection, JsonLd } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Free AI Photo Editor — Edit Photos by Describing the Change | Insightsize",
  description: "Type what you want in plain English — remove backgrounds, resize for any platform, upscale, convert, or compress — and the AI editor does the rest, privately in your browser.",
  openGraph: {
    title: "Free AI Photo Editor — Insightsize",
    description: "Edit photos by describing the change. Runs privately in your browser — free, no signup.",
    type: "website",
  },
};

const FAQS = [
  { q: "How does the AI editor work?", a: "You describe the edit in plain English — for example, \"remove the background and make it 1080 × 1350 for Instagram.\" The editor reads your instruction, plans the steps, and runs each one: real neural segmentation for background removal, high-quality resampling for resizing, and native encoding for conversion and compression. Everything runs in your browser." },
  { q: "Which edits can it make?", a: "Background removal (transparent PNG), platform-exact resizing (Instagram posts, Stories, YouTube thumbnails, or any custom dimensions), aspect-ratio expansion, 2×/4× upscaling, black & white conversion, background blur, rotation and flips, format conversion (PNG/JPG/WebP), and compression. You can combine several in one instruction." },
  { q: "Do my photos leave my device?", a: "No. Every step runs client-side in your browser, including the AI segmentation model (via WebAssembly). Nothing is uploaded to any server." },
  { q: "Is it free?", a: "Yes — the AI editor is free to use with no signup. Free accounts get 5 AI runs per day; Pro removes the cap." },
  { q: "What kinds of prompts work best?", a: "Plain, specific instructions: name the operation (remove the background, upscale, compress), the dimensions or platform, and the output format if you care (\"save as WebP\"). The chips under the input show exactly how your prompt was interpreted before you run it." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Insightsize AI Photo Editor",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
      <Header />
      <ToolShell
        title="AI Photo Editor"
        subtitle="Describe your edit in plain English — the AI plans the steps and runs them all, privately in your browser. Free, no signup."
      >
        <AiEditorClient />
      </ToolShell>
      <FaqSection faqs={FAQS} title="AI Photo Editor FAQ" />
      <Footer />
    </>
  );
}
