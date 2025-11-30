import type { Metadata } from "next";
import { Kanit, Inter } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";

const kanit = Kanit({
  weight: ['300', '400', '500', '600'],
  subsets: ['thai', 'latin'],
  variable: '--font-kanit',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "คลินิกแผนไทย วสส.พล",
  description: "ระบบจองคิวคลินิกแผนไทย วสส.พล",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${kanit.variable} ${inter.variable} antialiased bg-primary-50 text-stone-800 selection:bg-primary-200`}
      >
        <BookingProvider>
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
