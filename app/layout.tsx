import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MAYO — A Burger Experience · Lamezia Terme',
  description: 'Smasheria di Lamezia Terme. Doppia patty pressata sulla piastra, crosta caramellata, pane brioche tostato al burro. Ordine rapido via WhatsApp.',
  openGraph: {
    title: 'MAYO — A Burger Experience',
    description: 'Smasheria di Lamezia Terme.',
    type: 'website',
  },
  manifest: '/manifest.webmanifest',
  themeColor: '#ffe600',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MAYO',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee&family=Bungee+Shade&family=Rubik:wght@900&family=Archivo:ital,wght@0,400;0,700;1,400&family=Permanent+Marker&family=Space+Mono:wght@400;700&family=Anton&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
