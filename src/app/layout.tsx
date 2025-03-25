import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    template: '%s | Anotador de Carioca',
    default: 'Anotador de Carioca - Registra tus puntuaciones fácilmente',
  },
  description: "Lleva el registro de tus partidas de Carioca con este anotador digital. Registra puntuaciones, ve estadísticas y determina ganadores fácilmente.",
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://carioca.vercel.app/',
    title: 'Anotador de Carioca',
    siteName: 'Anotador de Carioca',
    description: 'Lleva el registro de tus partidas de Carioca con este anotador digital',
    images: [{
      url: 'https://carioca.vercel.app/api/og',
      width: 1200,
      height: 630,
      alt: 'Anotador de Carioca',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anotador de Carioca',
    description: 'Lleva el registro de tus partidas de Carioca',
    images: ['https://carioca.vercel.app/api/og'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}