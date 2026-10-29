import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — Insightsize",
  description: "Your Insightsize edit history, AI credits, and usage stats.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="hero-glow">
        <DashboardClient />
      </main>
      <Footer />
    </>
  );
}
