import type { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Yorizo",
  description: "中小企業の経営相談を支援するAIパートナー",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="text-slate-900 antialiased bg-gradient-to-b from-pink-50 via-purple-50 to-sky-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
