import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./master.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { ViewTransitionProvider } from "@/components/providers/ViewTransitionProvider";
import { CartSidebar } from "@/components/cart/CartSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VEXO | Futuristic E-Commerce",
  description: "Experience the future of shopping with VEXO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground relative antialiased">
        {/* Global Textures */}
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] scanlines" />
        <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.15] grain" />
        
        <Providers>
          <ViewTransitionProvider>
            <Header />
            <CartSidebar />
            <main className="flex-1">
              {children}
            </main>
          </ViewTransitionProvider>
        </Providers>
      </body>
    </html>
  );
}
