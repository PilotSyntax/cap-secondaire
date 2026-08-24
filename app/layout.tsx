import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://cap-secondaire.nadlyx.chatgpt.site";

export const metadata: Metadata = {
  title: "Cap Secondaire",
  description:
    "Une préparation personnalisée et positive aux admissions du secondaire au Québec.",
  applicationName: "Cap Secondaire",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cap Secondaire",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cap Secondaire",
    description: "Prépare-toi. Progresse. Réussis.",
    url: siteUrl,
    siteName: "Cap Secondaire",
    locale: "fr_CA",
    type: "website",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cap Secondaire",
    description: "Prépare-toi. Progresse. Réussis.",
    images: [`${siteUrl}/og.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#10214f",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  );
}
