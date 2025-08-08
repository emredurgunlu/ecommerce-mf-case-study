import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import AntdProvider from '@/providers/AntdProvider'

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Products Remote',
  description: 'E-commerce products catalog - Micro Frontend',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <QueryProvider>
          <AntdProvider>
            {children}
          </AntdProvider>
        </QueryProvider>
      </body>
    </html>
  )
}