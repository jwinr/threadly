import React, { FC } from "react"
import "../assets/main.css"
import { Amplify } from "aws-amplify"
import amplifyconfig from "../src/amplifyconfiguration.json"
Amplify.configure(amplifyconfig)
import { MobileViewProvider } from "../context/MobileViewContext"
import { UserProvider } from "../context/UserContext"
import { SignOutProvider } from "../context/SignOutContext"
import { CartProvider } from "../context/CartContext"
import { ToastProvider } from "../context/ToastContext"
import { FavoritesProvider } from "../context/FavoritesContext"
import Layout from "../layout/Layout"

const fetchCategories = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const url = `${baseUrl}/api/categories`

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })

    if (!res.ok) {
      console.error("Fetch failed with status:", res.status, res.statusText)
      throw new Error(
        `Failed to fetch categories: ${res.status} ${res.statusText}`
      )
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching categories:", error.message)
    throw error
  }
}

export const metadata = {
  title: "Threadly",
  description:
    "🛍 Full-stack React/Next.js e-commerce storefront with Stripe, PostgreSQL, styled-components, AWS Cognito, CloudFront, and S3.",
}

const RootLayout: FC<{ children: React.ReactNode }> = async ({ children }) => {
  const categories = await fetchCategories()

  return (
    <html lang="en">
      <head>
        <script src="https://js.stripe.com/v3/" async></script>
      </head>
      <body>
        <React.StrictMode>
          <MobileViewProvider>
            <ToastProvider>
              <UserProvider>
                <SignOutProvider>
                  <FavoritesProvider>
                    <CartProvider>
                      <Layout categories={categories}>{children}</Layout>
                    </CartProvider>
                  </FavoritesProvider>
                </SignOutProvider>
              </UserProvider>
            </ToastProvider>
          </MobileViewProvider>
        </React.StrictMode>
        <div id="portal-root"></div>
      </body>
    </html>
  )
}

export default RootLayout
