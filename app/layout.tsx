import type { Metadata, Viewport } from 'next'
import { SITE_URL } from '@/lib/site'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffe600',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MAYO — Smasheria · Lamezia Terme',
    template: '%s | MAYO Lamezia Terme',
  },
  description:
    'MAYO è la smasheria di Lamezia Terme. Smash burger con doppia patty pressata sulla piastra, crosta caramellata, pane brioche tostato al burro. Ordina in asporto via WhatsApp.',
  keywords: [
    'smash burger Lamezia Terme',
    'hamburger Lamezia Terme',
    'smasheria Lamezia Terme',
    'burger asporto Lamezia',
    'MAYO burger',
    'panino Lamezia Terme',
    'fast food Lamezia Terme',
    'smash burger calabria',
  ],
  authors: [{ name: 'MAYO Smasheria' }],
  creator: 'MAYO Smasheria',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'MAYO — Smasheria Lamezia Terme',
    title: 'MAYO — Smash Burger · Lamezia Terme',
    description:
      'Smasheria di Lamezia Terme. Doppia patty pressata, crosta caramellata, pane brioche al burro. Ordina in asporto via WhatsApp.',
    locale: 'it_IT',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MAYO Smasheria — Lamezia Terme',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAYO — Smash Burger · Lamezia Terme',
    description: 'Smasheria di Lamezia Terme. Ordina in asporto via WhatsApp.',
    images: ['/og-image.jpg'],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MAYO',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee&family=Bungee+Shade&family=Nunito:wght@900&family=Archivo:ital,wght@0,400;0,700;1,400&family=Permanent+Marker&family=Space+Mono:wght@400;700&family=Anton&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
