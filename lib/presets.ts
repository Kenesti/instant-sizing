export type Preset = { name: string; w: number; h: number };

export type Platform = {
  slug: string;
  name: string;
  color: string;
  presets: Preset[];
};

export const PLATFORMS: Platform[] = [
  {
    slug: "instagram",
    name: "Instagram",
    color: "#e1306c",
    presets: [
      { name: "Square Post", w: 1080, h: 1080 },
      { name: "Portrait Post", w: 1080, h: 1350 },
      { name: "Story", w: 1080, h: 1920 },
      { name: "Reel", w: 1080, h: 1920 },
      { name: "Profile Picture", w: 400, h: 400 },
      { name: "Carousel", w: 1080, h: 1080 },
      { name: "Landscape Post", w: 1080, h: 566 },
    ],
  },
  {
    slug: "youtube",
    name: "YouTube",
    color: "#ff0000",
    presets: [
      { name: "Thumbnail", w: 1280, h: 720 },
      { name: "Profile Photo", w: 800, h: 800 },
      { name: "Banner", w: 2560, h: 1440 },
      { name: "Shorts Thumbnail", w: 1080, h: 1920 },
      { name: "Community Post", w: 1080, h: 1080 },
      { name: "End Screen", w: 1280, h: 720 },
    ],
  },
  {
    slug: "tiktok",
    name: "TikTok",
    color: "#25f4ee",
    presets: [
      { name: "Video / Story Cover", w: 1080, h: 1920 },
      { name: "Profile Photo", w: 200, h: 200 },
      { name: "Shop Product Image", w: 1200, h: 1200 },
    ],
  },
  {
    slug: "facebook",
    name: "Facebook",
    color: "#1877f2",
    presets: [
      { name: "Profile Photo", w: 320, h: 320 },
      { name: "Story", w: 1080, h: 1920 },
      { name: "Cover Photo", w: 851, h: 315 },
      { name: "Post", w: 1080, h: 1350 },
      { name: "Banner", w: 820, h: 312 },
      { name: "Event Cover", w: 1920, h: 1080 },
    ],
  },
  {
    slug: "twitter",
    name: "Twitter / X",
    color: "#e7e9ea",
    presets: [
      { name: "Profile Photo", w: 400, h: 400 },
      { name: "Header", w: 1500, h: 500 },
      { name: "Post Image", w: 1200, h: 675 },
      { name: "Card Image", w: 800, h: 418 },
    ],
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    color: "#0a66c2",
    presets: [
      { name: "Profile Photo", w: 400, h: 400 },
      { name: "Cover Photo", w: 1584, h: 396 },
      { name: "Post Image", w: 1200, h: 627 },
      { name: "Article Banner", w: 600, h: 322 },
      { name: "Company Cover", w: 1512, h: 256 },
    ],
  },
  {
    slug: "pinterest",
    name: "Pinterest",
    color: "#e60023",
    presets: [
      { name: "Pin", w: 1000, h: 1500 },
      { name: "Profile Photo", w: 800, h: 800 },
      { name: "Board Cover", w: 600, h: 600 },
      { name: "Idea Ad", w: 1080, h: 1920 },
    ],
  },
  {
    slug: "twitch",
    name: "Twitch",
    color: "#9146ff",
    presets: [
      { name: "Emote", w: 112, h: 112 },
      { name: "Profile Photo", w: 800, h: 800 },
      { name: "Video Thumbnail", w: 1280, h: 720 },
      { name: "Profile Banner", w: 1920, h: 480 },
    ],
  },
  {
    slug: "discord",
    name: "Discord",
    color: "#5865f2",
    presets: [
      { name: "Server Icon", w: 512, h: 512 },
      { name: "Emote", w: 128, h: 128 },
      { name: "Avatar", w: 128, h: 128 },
      { name: "Server Banner", w: 960, h: 540 },
      { name: "Sticker", w: 320, h: 320 },
    ],
  },
  {
    slug: "shopify",
    name: "Shopify",
    color: "#95bf47",
    presets: [
      { name: "Product Image", w: 2048, h: 2048 },
      { name: "Collection Image", w: 2048, h: 2048 },
      { name: "Banner", w: 2048, h: 800 },
      { name: "Social Sharing", w: 1200, h: 628 },
    ],
  },
  {
    slug: "etsy",
    name: "Etsy",
    color: "#f1645e",
    presets: [
      { name: "Listing Photo", w: 2700, h: 2025 },
      { name: "Shop Icon", w: 500, h: 500 },
      { name: "Cover Photo", w: 1600, h: 400 },
      { name: "Carousel Banner", w: 1200, h: 300 },
    ],
  },
  {
    slug: "amazon",
    name: "Amazon",
    color: "#ff9900",
    presets: [{ name: "Product Image", w: 2000, h: 2000 }],
  },
  {
    slug: "ebay",
    name: "eBay",
    color: "#e53238",
    presets: [{ name: "Listing Photo", w: 1600, h: 1600 }],
  },
];

export const PIXEL_PRESETS: Preset[] = [
  { name: "400 × 400", w: 400, h: 400 },
  { name: "1080 × 1080", w: 1080, h: 1080 },
  { name: "1080 × 1920", w: 1080, h: 1920 },
  { name: "1920 × 1080", w: 1920, h: 1080 },
];
