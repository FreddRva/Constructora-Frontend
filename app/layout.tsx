import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
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
  title: "Constructora ERP - Microservicios",
  description: "Sistema de gestión para constructora con Go, PostgreSQL y Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900 flex flex-col">
        <QueryProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
