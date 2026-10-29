import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import UpscaleClient from "@/components/UpscaleClient";
import { FaqSection, JsonLd } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Free AI Image Upscaler — Enlarge Photos Up to 4×",
  description: "Increase image resolution up to 4× with multi-pass enhancement in your browser. Free, private, instant PNG download.",
  openGraph: { title: "Free AI Image Upscaler — Insightsize", description: "Increase image resolution up to 4× in your browser.", type: "website" },
};

const FAQS = [
  { q: "Can upscaling recreate lost detail?", a: "No tool can invent detail that isn't in the source. Insightsize uses high-quality multi-pass resampling with edge enhancement, which produces noticeably crisper enlargements than standard stretching." },
  { q: "What's the best source size?", a: "Images under 1500px work best. Very large sources hit browser memory limits at 4×." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Insightsize AI Upscaler", applicationCategory: "MultimediaApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <Header />
      <ToolShell title="AI Image Upscaler" subtitle="Enlarge photos up to 4× with multi-pass resampling and edge enhancement — in your browser, free.">
        <UpscaleClient />
      </ToolShell>
      <FaqSection faqs={FAQS} title="Upscaler FAQ" />
      <Footer />
    </>
  );
}
