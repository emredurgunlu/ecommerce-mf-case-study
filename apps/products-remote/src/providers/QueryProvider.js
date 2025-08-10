'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { QUERY_CONFIG } from '@/utils/constants'

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CONFIG.STALE_TIME,
        cacheTime: QUERY_CONFIG.CACHE_TIME,
        refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
        retry: QUERY_CONFIG.RETRY,
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