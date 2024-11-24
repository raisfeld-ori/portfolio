import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Spencer Sharp',
    default:
      'Ori Raisfeld - junior software developer with more than 2 years of experience',
  },
  description:
    'I"m Ori Raisfeld, a junior software developer with more than 2 years of experience. I build website and apps for clients and startups, from small local businesses to large corporations. I handle frontend, backend, and mobile development. I also design and manage the product roadmap. I love to build things that help people, and I hope you find value in my work.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
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
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
