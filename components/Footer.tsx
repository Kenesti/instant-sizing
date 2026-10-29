import Link from "next/link";

const cols = [
  {
    title: "Free tools",
    links: [
      { name: "Image Resizer", href: "/resize" },
      { name: "Image Compressor", href: "/compress" },
      { name: "Image Converter", href: "/convert" },
      { name: "Background Remover", href: "/background-remover" },
      { name: "AI Image Expand", href: "/expand" },
      { name: "AI Upscaler", href: "/upscale" },
    ],
  },
  {
    title: "Size guides",
    links: [
      { name: "All image sizes", href: "/sizes" },
      { name: "Instagram sizes", href: "/sizes/instagram" },
      { name: "YouTube sizes", href: "/sizes/youtube" },
      { name: "TikTok sizes", href: "/sizes/tiktok" },
      { name: "Etsy listing photo size", href: "/sizes/etsy" },
      { name: "Amazon product image size", href: "/sizes/amazon" },
    ],
  },
  {
    title: "Compare",
    links: [
      { name: "All comparisons", href: "/compare" },
      { name: "vs Instasize", href: "/compare/instasize" },
      { name: "vs Canva", href: "/compare/canva" },
      { name: "vs Picsart", href: "/compare/picsart" },
      { name: "vs Photoroom", href: "/compare/photoroom" },
      { name: "vs Pixlr", href: "/compare/pixlr" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Guides", href: "/guides" },
      { name: "Sign up", href: "/signup" },
      { name: "Log in", href: "/login" },
      { name: "Dashboard", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#26262a] bg-[#0a0a0b]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{c.title}</h3>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href + l.name}>
                    <Link href={l.href} className="text-sm text-zinc-400 transition hover:text-white">{l.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#26262a] pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Insightsize. A demo rebuild for educational purposes — not affiliated with Instasize.</p>
          <p className="text-xs text-zinc-500">Built with Next.js · Runs 100% in your browser</p>
        </div>
      </div>
    </footer>
  );
}
