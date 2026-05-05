import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bel & Blanc — Carrousel Studio",
  description: "Outil de production de carrousels Instagram pour Bel & Blanc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Public+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-ink">{children}</body>
    </html>
  );
}
