import { useQuery } from '@tanstack/react-query'
import { REMOTE_APPS } from '@/utils/constants'

export const useRemoteProducts = () => {
  return useQuery({
    queryKey: ['remote-products'],
    queryFn: async () => {
      const res = await fetch(`${REMOTE_APPS.PRODUCTS.URL}/api/products`)
      if (!res.ok) throw new Error('Failed to fetch products')
      return await res.json()
    },
    staleTime: 5 * 60 * 1000,
  })
}