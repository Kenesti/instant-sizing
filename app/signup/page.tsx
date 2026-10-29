import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up free — Insightsize",
  description: "Create a free Insightsize account. Free resizing, compression, conversion and 5 daily AI background removals.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="hero-glow">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <AuthForm mode="signup" />
        </div>
      </main>
      <Footer />
    </>
  );
}
