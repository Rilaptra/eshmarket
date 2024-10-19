import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Esh Market",
  description:
    "Explore and download powerful server scripts for your gaming community. Esh Market offers a wide range of high-quality and customizable scripts to enhance your gaming experience.",
  openGraph: {
    title: "Erzy.sh Market",
    description:
      "Discover and download top-notch server scripts for your gaming community. Enjoy our best script in Erzy.sh Market.",
    type: "website",
    siteName: "Erzy.sh Market",
    images: {
      url: "https://i.ibb.co/zbqtFBQ/1727490493494.jpg",
      alt: "Erzy.sh Market",
    },
    url: "https:/eshmarket.vercel.app",
  },
  icons: [
    {
      rel: "icon",
      url: "https://i.ibb.co/zbqtFBQ/1727490493494.jpg",
      type: "image/jpeg",
    },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
