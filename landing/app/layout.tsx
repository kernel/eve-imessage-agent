import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Baloo_2, Nunito } from 'next/font/google'
import './globals.css'

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'krill — a tiny freedom-loving krill in your texts',
  description:
    'krill is a very small, very shy, fervently free krill who lives in your iMessage. Text it anything — it can even swim out onto the web to look things up.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#04121f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
