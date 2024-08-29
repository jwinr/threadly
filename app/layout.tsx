import React, { FC, ReactNode } from "react"
import "../assets/main.css"
import AmplifyConfig from "@/lib/awsConfig"
import { MobileViewProvider } from "@/context/MobileViewContext"
import { UserProvider } from "@/context/UserContext"
import { SignOutProvider } from "@/context/SignOutContext"
import { CartProvider } from "@/context/CartContext"
import { ToastProvider } from "@/context/ToastContext"
import { FavoritesProvider } from "@/context/FavoritesContext"
import Layout from "../layout/Layout"
import StyledComponentsRegistry from "../lib/registry"
import cookie from "cookie"
import { headers } from "next/headers"
import Script from "next/script"

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  // Access cookies from the request headers on the server side
  const headersList = headers()
  const nonce = headers().get("x-nonce")
  const cookies = cookie.parse(headersList.get("cookie") || "")
  const userAttributes = cookies.userAttributes
    ? JSON.parse(cookies.userAttributes)
    : null

  return (
    <html lang="en">
      <head>
        <Script
          src="https://js.stripe.com/v3/"
          async
          nonce={nonce || ""}
          data-nscript="afterInteractive"
        ></Script>
      </head>
      <body>
        <React.StrictMode>
          <AmplifyConfig>
            <StyledComponentsRegistry nonce={nonce || ""}>
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
          </AmplifyConfig>
        </React.StrictMode>
        <div id="portal-root"></div>
      </body>
    </html>
  )
}

export default RootLayout
