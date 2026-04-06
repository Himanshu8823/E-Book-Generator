import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ConfirmProvider } from "@/components/ui/confirm-dialog"
import "./globals.css"
import "../styles/tiptap-pages.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI E-Book Generator - Create Professional Documents with AI",
  description:
    "Generate professional e-books, research papers, and project reports with AI assistance. Export to PDF, DOCX, Markdown, and HTML.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700;900&family=Montserrat:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=PT+Serif:wght@400;700&family=Crimson+Text:wght@400;600;700&family=Lora:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700;800;900&family=Nunito:wght@300;400;500;600;700;800;900&family=Ubuntu:wght@300;400;500;700&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600;700&family=Cabin:wght@400;500;600;700&family=Arvo:wght@400;700&family=Bitter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@300;400;500;700&family=Source+Code+Pro:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&family=Libre+Baskerville:wght@400;700&family=EB+Garamond:wght@400;500;600;700;800&family=Libre+Franklin:wght@300;400;500;600;700;800;900&family=Noto+Sans:wght@300;400;500;600;700;800;900&family=Noto+Serif:wght@400;700&family=PT+Sans:wght@400;700&family=Work+Sans:wght@300;400;500;600;700;800;900&family=Archivo:wght@300;400;500;600;700;800;900&family=Karla:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Serif:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Spectral:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ConfirmProvider>
          {children}
          <Toaster />
        </ConfirmProvider>
        <Analytics />
      </body>
    </html>
  )
}
