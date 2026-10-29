import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import AiEditorClient from "@/components/AiEditorClient";
import { FaqSection, JsonLd } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Free AI Photo Editor — Edit Photos by Describing the Change | Insightsize",
  description: "Type what you want in plain English — remove objects with spatial understanding (\"remove the man on the left\"), remove backgrounds, resize, adjust tone, add effects, upscale, convert, or compress — privately in your browser.",
  openGraph: {
    title: "Free AI Photo Editor — Insightsize",
    description: "Edit photos by describing the change. Runs privately in your browser — free, unlimited, no signup.",
    type: "website",
  },
};

const FAQS = [
  { q: "How does the AI editor work?", a: "You describe the edit in plain English — for example, \"remove the background, auto-enhance, and make it 1080 × 1350 for Instagram.\" The editor reads your instruction, plans the full pipeline of steps, and runs each one: real neural segmentation for background work, histogram-based analysis for auto-enhance, per-pixel processing for tone and color, and high-quality resampling for geometry. Everything runs in your browser." },
  { q: "Which edits can it make?", a: "AI object removal with spatial understanding — \"remove the man from the left side and blend the background seamlessly\" — the editor runs real object detection, finds the person on the left, cuts them out, and reconstructs the background with content-aware inpainting; background removal and portrait-style background blur (AI segmentation); resize for Instagram, TikTok, YouTube, LinkedIn, Pinterest, X, or any custom dimensions (with fit, fill, or black/white bar padding); crop or expand to any aspect ratio; rotate and flip; upscale 2× or 4×; brightness, contrast, saturation, and color temperature with exact amounts (\"brighten 30%\") or adverbs (\"slightly darker\"); auto-enhance; black & white, sepia, and invert; sharpen and denoise; film grain and vignette; one-look presets like \"cinematic\" or \"vintage\"; borders, polaroid frames, and rounded corners; plus format conversion (PNG/JPG/WebP) and compression." },
  { q: "How does \"remove the man on the left\" work?", a: "The AI analyzes your photo with a real object-detection model (running on your device via WebAssembly) that finds people, cars, animals, furniture, and 70+ common object classes. Your spatial language — left, right, top, bottom, center, largest, smallest — selects which detected instance to remove. The region is then reconstructed with content-aware inpainting: the surrounding pixels are diffused inward over many passes, weighted toward the known background, so the fill blends seamlessly instead of leaving a hole. The status line shows the detection confidence while it runs." },
  { q: "Do my photos leave my device?", a: "No. Every step runs client-side in your browser, including the object-detection and segmentation models (via WebAssembly). Nothing is uploaded to any server, ever." },
  { q: "Is it really free and unlimited?", a: "Yes — the AI editor is completely free with no signup, no daily caps, and no watermarks. Because all processing happens on your own device, there are no server costs to meter." },
  { q: "What kinds of prompts work best?", a: "Plain, specific instructions. Name the operation (remove the man on the left, brighten, sharpen), add an amount if you want (\"30%\", \"25px\") or a degree (\"slightly\", \"heavily\"), name a platform or dimensions for resizing, and a format to export (\"save as WebP\"). Combine freely with \"and\" or \"then\" — the chips under the input show exactly how your prompt was interpreted before anything runs." },
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
        subtitle="Describe any edit in plain English — AI object removal with spatial understanding, background work, tone and color, geometry, effects, and export — the AI plans the pipeline and runs it all, privately in your browser. Free, unlimited, no signup."
      >
        <AiEditorClient />
      </ToolShell>
      <FaqSection faqs={FAQS} title="AI Photo Editor FAQ" />
      <Footer />
    </>
  );
}
