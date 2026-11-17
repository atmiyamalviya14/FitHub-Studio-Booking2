import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitHub Studio | Front-Desk Booking Dashboard",
  description: "Internal session scheduling and booking management system for FitHub Studio staff.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
          <Navbar />
        </Suspense>
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 FitHub Studio — Internal Front-Desk Dashboard</p>
            <p className="text-[11px] text-slate-400">
              Hours: 07:00 – 21:00 • Personal Training, Yoga, HIIT & Pilates
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
