import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// If you have a local font file for "Université de Sousse" (e.g. "universitedesoussico.*"),
// you can enable it with next/font/local. Example (uncomment and adjust path/file):
// import localFont from 'next/font/local'
// const universiteFont = localFont({
//   src: '../public/fonts/universitedesoussico.woff2',
//   variable: '--font-universitedesousse',
//   display: 'swap',
// })
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SearchProvider } from '@/contexts/SearchContext'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Université de Sousse - We4Lead",
  description: "Université de Sousse - We4Lead",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}