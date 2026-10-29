export type Competitor = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  bestFor: string;
  pricing: string;
  freeOption: string;
  platforms: string;
  speed: string;
  easeOfUse: string;
  accuracy: string;
  pros: string[];
  cons: string[];
  rows: { feature: string; us: string; them: string; win: "us" | "them" | "tie" }[];
  verdict: string;
  intro: string;
  faqs: { q: string; a: string }[];
  source?: string;
};

export const US = {
  name: "Insightsize",
  tagline: "Free, private, browser-based image tools",
  pricing: "Free forever; Pro $9/mo",
  freeOption: "Full toolkit — resizer, compressor, converter, 5 AI bg removals/day",
  platforms: "Web (any modern browser, desktop & mobile)",
  speed: "Instant — runs locally, no upload round-trip",
  easeOfUse: "Single-purpose tools, zero learning curve",
  accuracy: "Real AI segmentation; preview before download",
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "instasize",
    name: "Instasize",
    tagline: "The original mobile-first AI photo editor",
    blurb: "The original inspiration for this category: a mobile-first photo editor with platform presets, AI editing, and paid AI plans.",
    bestFor: "Creators who live on their phones and want one app for editing and sizing",
    pricing: "Free tier; Pro from $4.99/mo (published rates vary)",
    freeOption: "Free resize and crop; AI features paid",
    platforms: "iOS, Android, web",
    speed: "Fast on mobile; web tools vary",
    easeOfUse: "Simple mobile editor",
    accuracy: "Mature presets tuned over a decade",
    pros: [
      "Ten years of mobile polish and a 4.7★ App Store rating",
      "Huge preset library covering 90+ platforms",
      "AI editing, expand, and upscaling in the paid plans",
      "Native apps work offline",
    ],
    cons: [
      "AI features sit behind a paid plan",
      "Web tools upload files to a server — processing isn't local",
      "Batch caps and credit pools on lower tiers",
    ],
    rows: [
      { feature: "Price to start", us: "Free, no card", them: "Free tier; AI from $4.99/mo", win: "us" },
      { feature: "Privacy model", us: "100% in-browser processing", them: "Server-side on web", win: "us" },
      { feature: "Platform presets", us: "13 platforms, exact pixels", them: "90+ platforms, curated", win: "them" },
      { feature: "AI background removal", us: "Free, 5/day, on-device", them: "Paid plan required", win: "us" },
      { feature: "Mobile apps", us: "Responsive web only", them: "Native iOS & Android", win: "them" },
      { feature: "Signup for basics", us: "Not required", them: "Required for saving", win: "us" },
    ],
    verdict:
      "Instasize is the stronger pick if you want a native mobile editor with a decade of polish and the widest preset library. Insightsize wins on price (free AI background removal), privacy (everything runs locally), and zero-friction use (no signup, no uploads). If you edit primarily on desktop and care about your photos staying on your device, choose Insightsize; if you edit on your phone all day, Instasize earns its rating.",
    intro:
      "Instasize is the original AI photo editor this category is named after — so how does a free, browser-only challenger compare? We built Insightsize on a simple premise: your photos shouldn't need to leave your device to be resized, compressed, or cut out. Here's an honest look at where each tool wins.",
    faqs: [
      { q: "Is Insightsize a good Instasize alternative?", a: "Yes, for browser-based work. Insightsize covers resizing, compression, conversion, AI background removal, expansion, and upscaling for free — while Instasize puts its AI features behind a paid plan. Instasize pulls ahead if you need native mobile apps or its enormous preset library." },
      { q: "Instasize vs Insightsize, which is better?", a: "They optimize for different things. Insightsize is better on price (free AI tools), privacy (fully local processing), and friction (no signup for basics). Instasize is better as a full mobile editor with offline apps, filters, and layers." },
      { q: "Does Insightsize have a mobile app like Instasize?", a: "Not yet — Insightsize runs as a responsive web app on mobile browsers. Instasize has native iOS and Android apps with offline editing." },
      { q: "Why is Insightsize free where Instasize charges?", a: "Because every tool runs in your browser, we have no server costs for processing. Instasize's AI runs on their infrastructure, which they meter with paid plans." },
    ],
  },
  {
    slug: "canva",
    name: "Canva",
    tagline: "The all-in-one design suite",
    blurb: "The world's most popular design suite — templates, brand kits, and Magic Resize, best known for design composition rather than quick photo fixes.",
    bestFor: "Teams designing full graphics, decks, and brand systems",
    pricing: "Free; Pro ~$15/mo",
    freeOption: "Generous free tier; Magic Resize gated to Pro",
    platforms: "Web, desktop, iOS, Android",
    speed: "Fast in-app; heavier to load than a single-purpose tool",
    easeOfUse: "Easy for design, overkill for a quick resize",
    accuracy: "Professional-grade design output",
    pros: [
      "Enormous template and stock library",
      "Real-time team collaboration and brand kits",
      "Full design surface: text, shapes, video, docs",
    ],
    cons: [
      "Magic Resize and background removal sit behind Pro (~$15/mo)",
      "A 30-second resize job becomes a 5-minute app session",
      "No plain pixel-exact export path for arbitrary dimensions",
    ],
    rows: [
      { feature: "Price to start", us: "Free, no card", them: "Free tier; Pro ~$15/mo", win: "us" },
      { feature: "Quick resize (30 seconds)", us: "Upload → preset → download", them: "Open canvas → resize → export", win: "us" },
      { feature: "Design composition", us: "Not our focus", them: "World-class templates & layers", win: "them" },
      { feature: "Team collaboration", us: "No", them: "Yes, real-time", win: "them" },
      { feature: "Background removal", us: "Free, on-device", them: "Pro feature, metered", win: "us" },
      { feature: "Exact pixel output", us: "Yes, any dimension", them: "Limited to preset sizes on free", win: "us" },
    ],
    verdict:
      "Canva is a design suite; Insightsize is a photo utility. If you're composing a brand system with templates and collaborators, Canva is unmatched. If you have a photo and need it at 1080×1350 in the next 30 seconds — without a subscription or an upload — Insightsize is the faster, cheaper path. Many creators keep both: Canva for design, Insightsize for sizing.",
    intro:
      "Canva is the giant everyone compares against, and for good reason. But its power is in composition — templates, layers, brand kits — and that comes with a learning curve and a Pro paywall around Magic Resize. Here's when a focused, free tool is simply the better job for the task.",
    faqs: [
      { q: "Is Insightsize a good Canva alternative?", a: "Only for photo tasks, not design. If your job is resizing, compressing, converting, or cutting out backgrounds, Insightsize does it free and faster. If your job is designing graphics from templates, stick with Canva — that's not what we do." },
      { q: "Canva vs Insightsize, which is better for social media images?", a: "For sizing existing photos for platforms: Insightsize — free, exact-pixel presets, no signup. For creating designed posts from scratch: Canva, by a wide margin." },
      { q: "Why is Canva's Magic Resize paid when Insightsize is free?", a: "Canva's resize is a feature inside a full design suite on their servers. Insightsize is a purpose-built tool that runs entirely in your browser, so there's nothing for us to meter." },
    ],
  },
  {
    slug: "picsart",
    name: "Picsart",
    tagline: "The creative super-app",
    blurb: "A broad creative suite with editing, AI generation, and a huge community — strong on mobile, heavier than a single-purpose utility.",
    bestFor: "Creators who want effects, stickers, and community alongside editing",
    pricing: "Free; Plus/Pro tiers (US-only on mobile)",
    freeOption: "Free tier with ads; AI tools credit-metered",
    platforms: "iOS, Android, web",
    speed: "Good on mobile; web app is heavy",
    easeOfUse: "Feature-rich, more to learn",
    accuracy: "Strong AI effects library",
    pros: [
      "Massive effects, stickers, and remix community",
      "AI generation and editing suite",
      "Solid mobile experience",
    ],
    cons: [
      "Free tier carries ads and credit gates",
      "Plus and Pro aren't sold on mobile outside the US",
      "Too much UI for a quick utility job",
    ],
    rows: [
      { feature: "Price to start", us: "Free, no card", them: "Free with ads; paid tiers", win: "us" },
      { feature: "Ad-free experience", us: "Yes", them: "No on free mobile", win: "us" },
      { feature: "Creative effects library", us: "None", them: "Huge", win: "them" },
      { feature: "Background removal", us: "Free, on-device", them: "Credit-metered", win: "us" },
      { feature: "Onboarding time", us: "Zero — tool is the homepage", them: "Account + walkthrough", win: "us" },
    ],
    verdict:
      "Picsart is a playground — effects, stickers, community. Insightsize is a utility. For a clean, ad-free, private resize or background removal, we win on speed and cost. For creative play and AI art, Picsart wins and we don't pretend otherwise.",
    intro:
      "Picsart has scale few tools can match: a huge community, deep effects, and AI everywhere. But scale means ads, credit meters, and a busy interface. If your actual job is 'cut out this product photo,' here's how the two compare.",
    faqs: [
      { q: "Is Insightsize a good Picsart alternative?", a: "For utility photo tasks — yes, and it's ad-free and runs locally. For creative effects, stickers, and community remixing, Picsart is the better fit." },
      { q: "Picsart vs Insightsize, which is better for product photos?", a: "Insightsize. Background removal is free, private, and instant, with transparent PNG export. Picsart meters similar tools behind credits." },
    ],
  },
  {
    slug: "photoroom",
    name: "Photoroom",
    tagline: "AI product photography",
    blurb: "Purpose-built for e-commerce product shots: staging, AI backgrounds, and batch editing — with export caps on lower tiers.",
    bestFor: "Online sellers producing staged product listings at volume",
    pricing: "Free; Pro from ~$12.99/mo",
    freeOption: "Free tier caps exports (50/mo) and mobile resolution (750×550px)",
    platforms: "iOS, Android, web",
    speed: "Fast, optimized for batch",
    easeOfUse: "Very easy for product shots",
    accuracy: "Excellent product segmentation",
    pros: [
      "Best-in-class product staging and AI backgrounds",
      "Batch editing built for catalogs",
      "Shopify integration",
    ],
    cons: [
      "Free tier caps exports at ~50/month and 750×550px on mobile",
      "Focused on products — not general image sizing",
      "Server-side processing",
    ],
    rows: [
      { feature: "Price to start", us: "Free, unlimited basics", them: "Free, capped exports", win: "us" },
      { feature: "Free-tier limits", us: "5 AI runs/day, utilities unlimited", them: "50 exports/mo, 750×550px mobile cap", win: "us" },
      { feature: "Product staging", us: "Not our focus", them: "Exceptional", win: "them" },
      { feature: "Batch background removal", us: "Pro plan", them: "Core feature", win: "them" },
      { feature: "Privacy", us: "On-device", them: "Server-side", win: "us" },
    ],
    verdict:
      "If you run a store and need staged, styled product photography in volume, Photoroom is genuinely excellent and worth paying for. If you need clean cutouts and platform-exact sizes without export caps, Insightsize's free tier does more, privately, for $0.",
    intro:
      "Photoroom is the specialist of this list — it lives and breathes e-commerce product photos. That focus makes it the best at staging, but its free tier has real caps. Here's how a free general-purpose alternative measures up.",
    faqs: [
      { q: "Is Insightsize a good Photoroom alternative?", a: "For background removal and sizing: yes, with no export caps on free utilities. For AI product staging, virtual models, and Shopify sync: Photoroom is the specialist and the better buy." },
      { q: "Photoroom vs Insightsize, which is better for Etsy sellers?", a: "For sizing to Etsy's 2700×2025 listing spec and quick cutouts, Insightsize is free and instant. For styled scenes that boost conversion, Photoroom's staging tools are worth the subscription." },
    ],
  },
  {
    slug: "pixlr",
    name: "Pixlr",
    tagline: "Browser photo editing suite",
    blurb: "A long-running browser editor with layers and AI tools — closer to a web Photoshop than a single-purpose utility.",
    bestFor: "Layer-based editing in the browser without desktop software",
    pricing: "Free; Premium ~$1.99/mo (published rates vary)",
    freeOption: "Free tier with ads and fewer AI credits",
    platforms: "Web, mobile",
    speed: "Depends on connection; heavier app",
    easeOfUse: "Moderate — layer editor paradigm",
    accuracy: "Good; AI tools credit-based",
    pros: [
      "Layers and advanced editing in-browser",
      "Cheap premium tier",
      "Long track record",
    ],
    cons: [
      "Ads on the free tier",
      "Credit-based AI tools",
      "Heavier than needed for utility tasks",
    ],
    rows: [
      { feature: "Price to start", us: "Free, no card", them: "Free with ads", win: "us" },
      { feature: "Ad-free", us: "Yes", them: "No on free", win: "us" },
      { feature: "Layer editing", us: "No", them: "Yes", win: "them" },
      { feature: "AI credits", us: "Simple 5/day free AI", them: "Credit purchases", win: "us" },
      { feature: "Load time to first edit", us: "Seconds — it's one page", them: "Full app load", win: "us" },
    ],
    verdict:
      "Pixlr is the right tool when you need layers in a browser without installing anything. For utility jobs — resize, compress, cut out — Insightsize is faster to load, ad-free, and processes locally. Different tools for different jobs.",
    intro:
      "Pixlr is the closest ancestor to what we do — browser-based editing, no install. The difference is scope: Pixlr is a full layer editor, we're a set of instant utilities. Here's how that plays out in practice.",
    faqs: [
      { q: "Is Insightsize a good Pixlr alternative?", a: "For quick utility edits, yes — lighter, ad-free, private. For layer-based editing, masks, and advanced retouching, Pixlr is the more capable editor." },
      { q: "Pixlr vs Insightsize, which is faster for resizing?", a: "Insightsize — there's no app to load and no account to create. Open the page, drop the image, download." },
    ],
  },
  {
    slug: "pixelcut",
    name: "Pixelcut",
    tagline: "AI product photos & background removal",
    blurb: "Mobile-first AI product photography with strong background removal and magic upscale — similar free-tier caps to Photoroom.",
    bestFor: "Sellers creating marketplace-ready product shots on a phone",
    pricing: "Free; Pro subscription",
    freeOption: "Limited daily uses; resolution caps",
    platforms: "iOS, Android, web",
    speed: "Fast on mobile",
    easeOfUse: "Very easy",
    accuracy: "Strong on products",
    pros: [
      "Excellent one-tap background removal",
      "Magic upscale tailored to product photos",
      "Marketplace size templates",
    ],
    cons: [
      "Free tier caps daily uses and resolution",
      "Server-side processing",
      "Product-photo focus, not general sizing",
    ],
    rows: [
      { feature: "Price to start", us: "Free, no card", them: "Free with usage caps", win: "us" },
      { feature: "Background removal cost", us: "Free, 5/day, on-device", them: "Capped on free", win: "us" },
      { feature: "Product-specific AI", us: "General segmentation", them: "Product-tuned", win: "them" },
      { feature: "Privacy", us: "On-device", them: "Server-side", win: "us" },
    ],
    verdict:
      "Pixelcut's product-tuned AI is very good, especially on a phone. Insightsize matches the core jobs — cutouts and exact sizing — with a private, local model and no daily cap on utilities. For seller workflow depth, Pixelcut wins; for free and private basics, we do.",
    intro:
      "Pixelcut sits in the same product-photo niche as Photoroom, with slick one-tap tools. Its constraint is the free tier. If you're choosing between them, this is the comparison that matters.",
    faqs: [
      { q: "Is Insightsize a good Pixelcut alternative?", a: "For background removal and resizing without usage caps — yes, and processing stays on your device. Pixelcut's product-specific magic tools remain stronger for marketplace sellers." },
      { q: "Pixelcut vs Insightsize, which is more private?", a: "Insightsize. Every tool, including the AI background remover, runs in your browser. Pixelcut uploads your photos to its servers for processing." },
    ],
  },
  {
    slug: "vsco",
    name: "VSCO",
    tagline: "Filters and film aesthetics",
    blurb: "The filter app — presets, film emulation, and a photography community. Not a utility tool.",
    bestFor: "Photographers crafting a consistent visual aesthetic",
    pricing: "Free; Membership ~$19.99/yr",
    freeOption: "Limited preset library free",
    platforms: "iOS, Android, web",
    speed: "Fast on mobile",
    easeOfUse: "Easy for filters",
    accuracy: "Beautiful color science",
    pros: [
      "Best-in-class film-emulation presets",
      "Strong photography community",
      "Refined minimal interface",
    ],
    cons: [
      "Not built for resizing or exact platform sizes",
      "No background removal or conversion",
      "Best presets are members-only",
    ],
    rows: [
      { feature: "Price to start", us: "Free, no card", them: "Free; membership ~$19.99/yr", win: "us" },
      { feature: "Filters & film looks", us: "None", them: "Industry-leading", win: "them" },
      { feature: "Platform-exact resizing", us: "Core feature", them: "Not offered", win: "us" },
      { feature: "Background removal", us: "Free, on-device", them: "Not offered", win: "us" },
    ],
    verdict:
      "VSCO and Insightsize barely overlap. VSCO makes photos beautiful; Insightsize makes photos fit. If you're choosing between them, you're really choosing between aesthetic grading and utility processing — many photographers use both in one workflow.",
    intro:
      "VSCO appears in almost every 'Instasize alternative' list, but it solves a different problem. This comparison keeps the record straight on what each is actually for.",
    faqs: [
      { q: "Is Insightsize a good VSCO alternative?", a: "Not really — they do different jobs. VSCO is for filters and aesthetics; Insightsize is for resizing, compressing, converting, and background removal. Photographers commonly use both." },
      { q: "VSCO vs Insightsize, which should I use for Instagram?", a: "Use VSCO to grade your photo's look, then Insightsize to size it exactly to 1080×1350 — the pipeline is faster than either app alone." },
    ],
  },
  {
    slug: "snapseed",
    name: "Snapseed",
    tagline: "Free pro-grade mobile editor",
    blurb: "Google's free, complete mobile editor — RAW support, selective edits, no ads. Weak on export presets and web.",
    bestFor: "Mobile photographers who want free manual control",
    pricing: "Completely free",
    freeOption: "Everything free",
    platforms: "iOS, Android only (no web)",
    speed: "Fast, native",
    easeOfUse: "Moderate — pro controls",
    accuracy: "Excellent tone and detail tools",
    pros: [
      "100% free, no ads, no account",
      "RAW development and selective editing",
      "Google-grade quality",
    ],
    cons: [
      "No web version at all",
      "No platform size presets for social formats",
      "No AI background removal",
    ],
    rows: [
      { feature: "Price", us: "Free", them: "Free", win: "tie" },
      { feature: "Web version", us: "Yes", them: "No", win: "us" },
      { feature: "Platform presets", us: "Yes, exact pixels", them: "No", win: "us" },
      { feature: "RAW editing", us: "No", them: "Yes", win: "them" },
      { feature: "AI background removal", us: "Yes, on-device", them: "No", win: "us" },
    ],
    verdict:
      "Snapseed is the most generous free editor on mobile — nothing we offer beats its RAW pipeline. But it has no web version, no platform presets, and no background removal. Insightsize complements it: Snapseed for grading, Insightsize for sizing and cutouts on desktop.",
    intro:
      "Snapseed is what free should look like — Google gives the whole thing away. An honest comparison has to respect that, while noting what it doesn't try to do.",
    faqs: [
      { q: "Is Insightsize a good Snapseed alternative?", a: "On desktop, yes — Snapseed has no web version. On mobile, Snapseed is the stronger free editor for manual adjustments, while Insightsize adds presets and AI background removal Snapseed lacks." },
      { q: "Snapseed vs Insightsize, which is better?", a: "Snapseed: tone, detail, RAW. Insightsize: exact platform sizing, format conversion, and AI cutouts. Different jobs, both free." },
    ],
  },
];
