// src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-primary',
  display: 'swap',  // 添加 display swap
  preload: true,    // 确保字体预加载
});

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
        {children}
        <Analytics />
      </body>
    </html>
  )
}