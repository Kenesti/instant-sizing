import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolShell from "@/components/ToolShell";
import ExpandClient from "@/components/ExpandClient";
import { FaqSection, JsonLd } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Free AI Image Expand — Uncrop & Extend Photos Online",
  description: "Extend photos to 16:9, 4:5, 1:1 or 9:16 with edge-aware expansion in your browser. Free, private, instant download.",
  openGraph: { title: "Free AI Image Expand — Insightsize", description: "Extend photos to any aspect ratio in your browser.", type: "website" },
};

const FAQS = [
  { q: "What does expand do?", a: "It extends your photo to a wider aspect ratio, generating a natural-looking extension of the scene from the photo's own edges — great for turning square shots into widescreen banners or Stories." },
  { q: "Which ratio should I pick?", a: "16:9 for YouTube thumbnails and banners, 4:5 for Instagram feed posts, 9:16 for Stories and Reels, 1:1 for square grids." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Insightsize AI Image Expand", applicationCategory: "MultimediaApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <Header />
      <ToolShell title="AI Image Expand" subtitle="Extend photos beyond their borders to any aspect ratio — no cropping, no uploads, free in your browser.">
        <ExpandClient />
      </ToolShell>
      <FaqSection faqs={FAQS} title="Image Expand FAQ" />
      <Footer />
    </>
  );
}
