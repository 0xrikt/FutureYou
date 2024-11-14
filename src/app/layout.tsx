import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { notoSansSC } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: '未选择的路：AI对话十年后的自己',
  description: '让AI推演十年后的自己，指引当下的选择',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${notoSansSC.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`min-h-screen ${notoSansSC.className}`}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  )
}