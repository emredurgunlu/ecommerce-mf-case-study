import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import AntdProvider from '@/providers/AntdProvider'
import '@ant-design/v5-patch-for-react-19'

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Host App',
  description: 'E-commerce Micro Frontend Host Application',
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
