import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import CompressClient from "@/components/CompressClient";
import { FaqSection, JsonLd } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Free Image Compressor — Shrink JPG, PNG & WebP Online",
  description: "Compress images in your browser with a live quality slider. Reduce file size for faster websites and uploads — free, private, no signup.",
  openGraph: { title: "Free Image Compressor — Insightsize", description: "Compress images in your browser with a live quality slider.", type: "website" },
};

const FAQS = [
  { q: "How does the compressor work?", a: "Your image is re-encoded in your browser using the native canvas encoder at the quality you pick. Nothing is uploaded." },
  { q: "What's the best quality setting?", a: "70–85% works for most photos and can cut file size by more than half with no visible difference. Use WebP for the smallest files." },
  { q: "Will I lose quality?", a: "Some. JPG and WebP are lossy formats — the slider lets you trade size for fidelity, and the preview shows the exact result before you download." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Insightsize Image Compressor", applicationCategory: "MultimediaApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <Header />
      <ToolShell title="Free Image Compressor" subtitle="Shrink file sizes with a live quality slider and instant preview — faster stores, lighter emails, quicker uploads.">
        <CompressClient />
      </ToolShell>
      <FaqSection faqs={FAQS} title="Image Compressor FAQ" />
      <Footer />
    </>
  );
}
