import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://insightsize.app"),
  title: {
    default: "Insightsize — AI Photo Tools for Creators",
    template: "%s",
  },
  description: "Insightsize is a photo toolkit for online sellers and creators. Resize, compress, convert, remove backgrounds and expand photos for free in your browser.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    siteName: "Insightsize",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
