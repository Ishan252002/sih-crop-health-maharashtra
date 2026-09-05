import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppStoreProvider } from "@/lib/store/app-store";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const devanagari = Noto_Sans_Devanagari({ variable: "--font-devanagari", subsets: ["devanagari"], weight: ["400", "500", "600", "700"], display: "swap" });

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
