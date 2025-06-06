import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { Analytics } from "@vercel/analytics/react"

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Ori Raisfeld',
    default:
      'Ori Raisfeld - junior software developer with more than 2 years of experience',
  },
  description:
    'fullstack dev with 2+ years of experience.',
  alternates: {
    types: {
      'application/rss+xml': `https://oriraisfeld.vercel.app/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5103433678055720"
     crossOrigin="anonymous"></script>
     <meta name="google-adsense-account" content="ca-pub-5103433678055720"></meta>
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Analytics></Analytics>
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
