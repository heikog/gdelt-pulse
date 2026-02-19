import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GDELT Pulse - Global Events Visualization',
  description: 'Real-time visualization of global events on an interactive 3D globe using GDELT data',
  keywords: 'GDELT, global events, data visualization, 3D globe, real-time news, conflict, diplomacy, protest, disaster',
  authors: [{ name: 'PromptPeak' }],
  openGraph: {
    title: 'GDELT Pulse - Global Events Visualization',
    description: 'Real-time visualization of global events on an interactive 3D globe',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GDELT Pulse - Global Events on 3D Globe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GDELT Pulse - Global Events Visualization',
    description: 'Real-time visualization of global events on an interactive 3D globe',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased overflow-hidden`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}