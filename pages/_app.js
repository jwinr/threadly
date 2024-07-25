import React from "react"
import Layout from "../layout/Layout"
import "../assets/main.css"
import { Amplify } from "aws-amplify"
import amplifyconfig from "../src/amplifyconfiguration.json"
Amplify.configure(amplifyconfig)
import { MobileViewProvider } from "../context/MobileViewContext"
import { UserProvider } from "../context/UserContext"
import { SignOutProvider } from "../context/SignOutContext"
import { CartProvider } from "../context/CartContext"
import ErrorBoundary from "../components/common/ErrorBoundary"

function Nexari({ Component, pageProps, categories }) {
  return (
    <>
      <React.StrictMode>
        <MobileViewProvider>
          <UserProvider>
            <SignOutProvider>
              <CartProvider>
                <ErrorBoundary>
                  <Layout categories={categories}>
                    <Component {...pageProps} />
                  </Layout>
                </ErrorBoundary>
              </CartProvider>
            </SignOutProvider>
          </UserProvider>
        </MobileViewProvider>
      </React.StrictMode>
    </>
  )
}

export default Nexari
