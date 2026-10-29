import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="hero-glow flex min-h-[60vh] items-center">
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">404</p>
          <h1 className="mt-3 text-4xl font-bold">This size doesn&apos;t fit</h1>
          <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist. Try one of the tools instead.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary">Back home</Link>
            <Link href="/tools" className="btn-ghost">Browse tools</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
