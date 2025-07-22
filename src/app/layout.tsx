import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "./components/AuthProvider"
import { Toaster } from "sonner"
import { ThemeProvider } from "./components/Theme-Provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "FIRSTNEXT - Modern Authentication",
  description: "Next.js app with Supabase authentication and modern UI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: "toast",
                duration: 4000,
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
