import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log in — Insightsize",
  description: "Log in to your Insightsize account to see your edit history and AI credits.",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="hero-glow">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <AuthForm mode="login" />
        </div>
      </main>
      <Footer />
    </>
  );
}
