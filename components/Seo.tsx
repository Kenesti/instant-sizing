"use client";

import { useState, useEffect } from "react";

export type Faq = { q: string; a: string };

export function FaqSection({ faqs, title = "Frequently Asked Questions" }: { faqs: Faq[]; title?: string }) {
  return (
    <section className="section" aria-label="FAQ">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="cursor-pointer list-none font-semibold text-white flex items-center justify-between">
                {f.q}
                <span className="text-violet-400 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-6 text-xs text-zinc-500 sm:px-6">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i < items.length - 1 ? (
              <>
                <a href={it.href} className="hover:text-zinc-300">{it.name}</a>
                <span aria-hidden="true">/</span>
              </>
            ) : (
              <span className="text-zinc-400">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function useLocalUser() {
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("is_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);
  return user;
}
