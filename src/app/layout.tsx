import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TrackingPixels from "@/components/TrackingPixels";
import { COMPANY } from "@/lib/copy";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Custom powder coat — ASAP SIGNATURE FENCE",
    template: "%s | ASAP SIGNATURE FENCE",
  },
  description:
    "Custom powder-coat and color-finish for ASAP Fence gates, frames, and hardware in Florida. Accent a handle or hinge without recoating the whole gate. Get a color quote.",
  keywords: [
    "powder coat gates Florida",
    "custom gate color",
    "accent hardware powder coat",
    "ASAP Fence",
    "Bradenton powder coat",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: COMPANY.name,
    title: "Custom powder coat for gates, frames, and hardware",
    description:
      "Bespoke powder-coat color for ASAP Fence hardware and frames. Quote-only — no public coat price list.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <TrackingPixels />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
