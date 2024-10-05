import React from 'react'
import '../assets/main.css'
import { Inter } from 'next/font/google'
import AmplifyConfig from '@/lib/awsConfig'
import { MobileViewProvider } from '@/context/MobileViewContext'
import { UserProvider } from '@/context/UserContext'
import { SignOutProvider } from '@/context/SignOutContext'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import Providers from './providers'
import Layout from '@/components/Layout/Layout'
import StyledComponentsRegistry from '@/lib/registry'
import cookie from 'cookie'
import { headers } from 'next/headers'
import { Metadata } from 'next'
import { Customer } from '@/types/user'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threadly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  // Access cookies from the request headers on the server side
  const headersList = headers()
  const nonce = headers().get('x-nonce')
  const cookies = cookie.parse(headersList.get('cookie') || '')
  const userAttributes: Customer | null = cookies.userAttributes
    ? (JSON.parse(cookies.userAttributes) as Customer)
    : null

  return (
    <html lang="en">
      <body className={inter.className}>
        <React.StrictMode>
          <AmplifyConfig>
            <Providers>
              <StyledComponentsRegistry nonce={nonce || ''}>
                <MobileViewProvider>
                  <ToastProvider>
                    <UserProvider initialUserAttributes={userAttributes}>
                      <SignOutProvider>
                        <FavoritesProvider>
                          <CartProvider>
                            <Layout>{children}</Layout>
                          </CartProvider>
                        </FavoritesProvider>
                      </SignOutProvider>
                    </UserProvider>
                  </ToastProvider>
                </MobileViewProvider>
              </StyledComponentsRegistry>
            </Providers>
          </AmplifyConfig>
        </React.StrictMode>
        <div id="portal-root"></div>
      </body>
    </html>
  )
}
