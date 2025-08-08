'use client'

import { ConfigProvider, theme, App } from 'antd'
import trTR from 'antd/locale/tr_TR'

export default function AntdProvider({ children }) {
  return (
    <ConfigProvider
      locale={trTR}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          // Primary colors for e-commerce
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          
          // Typography
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          fontSize: 14,
          
          // Layout
          borderRadius: 6,
          wireframe: false,
        },
        components: {
          // Card component customization
          Card: {
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
          // Button customization
          Button: {
            borderRadius: 6,
            controlHeight: 40,
          },
          // Input customization
          Input: {
            borderRadius: 6,
            controlHeight: 40,
          },
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  )
}