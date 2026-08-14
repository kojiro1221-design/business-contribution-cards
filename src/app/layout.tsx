import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Business Contribution Cards',
  description: '貢献につながる対話カード〜相手を知ることで、貢献が見つかる',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
