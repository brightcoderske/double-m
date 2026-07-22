import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Double M Agency | Househelps, Nannies & Caregivers in Nairobi",
    template: "%s | Double M Agency",
  },
  description:
    "Double M Agency in Kahawa West places vetted househelps, nannies, dayburgs, caregivers, house managers, shamba workers and business staff across Nairobi and Kenya.",
  icons: {
    icon: "/brand/logo.jpeg",
    shortcut: "/brand/logo.jpeg",
    apple: "/brand/logo.jpeg",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Double M Agency | Trusted Househelp & Nanny Agency in Nairobi",
    description:
      "Vetted househelps, nannies, caregivers and reliable staff, professionally matched and supported from Kahawa West, Nairobi.",
    url: "/",
    siteName: "Double M Agency",
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
