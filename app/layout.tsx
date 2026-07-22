import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const editorial = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-editorial",
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
    "Double M Agency in Kahawa West places vetted househelps, nannies, dayburgs, caregivers, house managers, shamba boys and business staff across Nairobi and Kenya.",
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${editorial.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
