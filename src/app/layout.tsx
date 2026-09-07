import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppStoreProvider } from "@/lib/store/app-store";

/**
 * Self-hosted variable fonts, loaded from public/fonts so the build makes no
 * network request to any external font CDN. Same three families as before.
 * Files are the official Fontsource builds; only the subsets actually used are bundled.
 */
const inter = localFont({
  src: "../../public/fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const devanagari = localFont({
  src: "../../public/fonts/noto-sans-devanagari-devanagari-wght-normal.woff2",
  variable: "--font-devanagari",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "KrishiRakshak · Maharashtra Crop Health Intelligence", template: "%s · KrishiRakshak" },
  description: "Early detection and management of crop diseases and pest infestations. AI diagnosis, weather risk forecasting, expert validation and geospatial surveillance for Maharashtra.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b3d2e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${devanagari.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
