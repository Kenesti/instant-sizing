import type { MetadataRoute } from "next";
import { PLATFORMS } from "@/lib/presets";
import { COMPETITORS } from "@/lib/competitors";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://insightsize.app";
  const now = new Date();

  const core = ["", "/tools", "/sizes", "/guides", "/compare", "/resize", "/compress", "/convert", "/background-remover", "/expand", "/upscale", "/signup", "/login"].map((p) => ({
    url: base + p,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const sizes = PLATFORMS.map((p) => ({
    url: `${base}/sizes/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const compares = COMPETITORS.map((c) => ({
    url: `${base}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...core, ...sizes, ...compares];
}
