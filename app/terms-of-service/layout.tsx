import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our Terms of Service and how it relates to you.',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: 'Terms of Service',
    description: 'Read our Terms of Service and how it relates to you.',
    url: 'https://nextjs.org',
    siteName: 'Threadly',
    images: [
      {
        url: 'https://nextjs.org/og.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
