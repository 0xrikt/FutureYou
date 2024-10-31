// src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import { Footer } from '@/components/ui/Footer'
import './globals.css'

const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-primary',
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
    <html lang="zh">
      <body className={notoSansSC.variable}>
        {children}
      </body>
    </html>
  )
}
