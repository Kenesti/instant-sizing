import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import ConvertClient from "@/components/ConvertClient";
import { FaqSection, JsonLd } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Free Image Converter — PNG, JPG & WebP Online",
  description: "Convert images between PNG, JPG, and WebP in your browser. Free, private, instant download — no signup, no watermarks.",
  openGraph: { title: "Free Image Converter — Insightsize", description: "Convert images between PNG, JPG, and WebP in your browser.", type: "website" },
};

const FAQS = [
  { q: "Which formats can I convert between?", a: "PNG, JPG, and WebP in any direction. PNG output preserves transparency; JPG output flattens it onto a white background." },
  { q: "Does converting reduce quality?", a: "JPG and WebP use lossy encoding at 92% quality by default — visually near-identical. PNG output is lossless." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Insightsize Image Converter", applicationCategory: "MultimediaApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <Header />
      <ToolShell title="Free Image Converter" subtitle="Convert between PNG, JPG, and WebP without leaving your browser. Transparent PNGs stay transparent.">
        <ConvertClient />
      </ToolShell>
      <FaqSection faqs={FAQS} title="Image Converter FAQ" />
      <Footer />
    </>
  );
}
