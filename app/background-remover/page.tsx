import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import BgRemover from "@/components/BgRemover";
import { FaqSection, JsonLd } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Free AI Background Remover — Remove Backgrounds Online",
  description: "Remove image backgrounds with real AI segmentation, right in your browser. Free, private, no signup. Download transparent PNG cutouts.",
  openGraph: {
    title: "Free AI Background Remover — Insightsize",
    description: "Remove image backgrounds with real AI segmentation, right in your browser. Free, private, no signup.",
    type: "website",
  },
};

const FAQS = [
  { q: "Is this background remover really AI?", a: "Yes. It runs a real neural segmentation model (ISNet-style, via ONNX runtime) on your device. Nothing is faked or hardcoded — each photo is analyzed individually." },
  { q: "Do my photos leave my device?", a: "No. The model runs entirely in your browser using WebAssembly. Your photo is never uploaded to any server." },
  { q: "Is it free?", a: "Yes, the background remover is free. Free accounts get 5 runs per day; Pro removes the cap." },
  { q: "What format is the output?", a: "A PNG with a transparent alpha channel, ready for product listings, thumbnails, and design tools." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Insightsize Background Remover",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
      <Header />
      <ToolShell
        title="AI Background Remover"
        subtitle="Upload a photo and real AI segmentation isolates your subject — in your browser, private, no signup. Free."
      >
        <BgRemover />
      </ToolShell>
      <FaqSection faqs={FAQS} title="Background Remover FAQ" />
      <Footer />
    </>
  );
}
