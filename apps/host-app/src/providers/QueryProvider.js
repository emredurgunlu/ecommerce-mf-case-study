'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: 3,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ReactQueryDevtools ve ReactQueryRewind development aşamasını kolaylaştırmak amaçlı React Query için geliştirme aracıdır.
      biri npm install @tanstack/react-query-devtools şeklinde yüklenir diğeri ise bir chrome eklentisidir. */}
      {/* {process.env.NODE_ENV === 'development' && (
        <>
          <ReactQueryDevtools initialIsOpen={false} />
          <ReactQueryRewind />
        </>
      )} */}
    </QueryClientProvider>
  )
}